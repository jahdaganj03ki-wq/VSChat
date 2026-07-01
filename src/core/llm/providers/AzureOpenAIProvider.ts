import { OpenAIProvider } from './OpenAIProvider';
import type { LLMMessage, LLMStreamEvent, LLMCompletionOptions } from '../LLMInterface';

export class AzureOpenAIProvider extends OpenAIProvider {
  readonly name = 'azure-openai' as string;

  constructor(
    apiKey: string,
    baseUrl: string,
    private deploymentName: string,
    private apiVersion: string = '2024-10-01-preview',
  ) {
    super(apiKey, baseUrl);
  }

  private getEndpoint(): string {
    return `${this['baseUrl']}/openai/deployments/${this.deploymentName}/chat/completions?api-version=${this.apiVersion}`;
  }

  async *stream(
    messages: LLMMessage[],
    options?: LLMCompletionOptions,
  ): AsyncGenerator<LLMStreamEvent> {
    const response = await fetch(this.getEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this['apiKey'],
      },
      body: JSON.stringify({
        messages,
        max_tokens: options?.maxTokens || 4096,
        temperature: options?.temperature ?? 0.7,
        top_p: options?.topP ?? 1,
        stream: true,
      }),
    });

    if (!response.ok) {
      yield { type: 'error', error: `Azure OpenAI error: ${response.status}` };
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (!trimmed.startsWith('data: ')) continue;

          try {
            const json = JSON.parse(trimmed.slice(6));
            const content = json.choices?.[0]?.delta?.content || '';
            if (content) yield { type: 'token', content };
          } catch {
            // skip
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    yield { type: 'done' };
  }

  async complete(messages: LLMMessage[], options?: LLMCompletionOptions): Promise<string> {
    const response = await fetch(this.getEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this['apiKey'],
      },
      body: JSON.stringify({
        messages,
        max_tokens: options?.maxTokens || 4096,
        temperature: options?.temperature ?? 0.7,
      }),
    });

    const json = await response.json();
    return json.choices?.[0]?.message?.content || '';
  }
}
