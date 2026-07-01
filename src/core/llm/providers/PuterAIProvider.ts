import type {
  LLMProvider,
  LLMMessage,
  LLMStreamEvent,
  LLMCompletionOptions,
} from '../LLMInterface';

export class PuterAIProvider implements LLMProvider {
  readonly name = 'puter-ai';

  constructor(
    private apiKey: string,
    private baseUrl: string = 'https://api.puter.com/v1',
  ) {}

  async *stream(
    messages: LLMMessage[],
    options?: LLMCompletionOptions,
  ): AsyncGenerator<LLMStreamEvent> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || 'puter-gpt-4o',
        messages,
        max_tokens: options?.maxTokens || 4096,
        stream: true,
      }),
    });

    if (!response.ok) {
      yield { type: 'error', error: `Puter AI error: ${response.status}` };
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
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || 'puter-gpt-4o',
        messages,
        max_tokens: options?.maxTokens || 4096,
      }),
    });

    const json = await response.json();
    return json.choices?.[0]?.message?.content || '';
  }

  countTokens(messages: LLMMessage[]): number {
    return messages.reduce((sum, m) => sum + Math.ceil(m.content.length / 4), 0);
  }
}
