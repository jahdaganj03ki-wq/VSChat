import type {
  LLMProvider,
  LLMMessage,
  LLMStreamEvent,
  LLMCompletionOptions,
} from '../LLMInterface';

export class AnthropicProvider implements LLMProvider {
  readonly name = 'anthropic';

  constructor(
    private apiKey: string,
    private baseUrl: string = 'https://api.anthropic.com/v1',
  ) {}

  async *stream(
    messages: LLMMessage[],
    options?: LLMCompletionOptions,
  ): AsyncGenerator<LLMStreamEvent> {
    const system = messages.find((m) => m.role === 'system')?.content || '';
    const chatMessages = messages.filter((m) => m.role !== 'system');

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: options?.model || 'claude-3-5-sonnet-20241022',
        max_tokens: options?.maxTokens || 4096,
        temperature: options?.temperature ?? 0.7,
        system,
        messages: chatMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      yield { type: 'error', error: `Anthropic API error: ${response.status} - ${error}` };
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      yield { type: 'error', error: 'No response body' };
      return;
    }

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
          if (!trimmed || !trimmed.startsWith('data: ')) continue;

          try {
            const json = JSON.parse(trimmed.slice(6));
            if (json.type === 'content_block_delta' && json.delta?.text) {
              yield { type: 'token', content: json.delta.text };
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    yield { type: 'done' };
  }

  async complete(messages: LLMMessage[], options?: LLMCompletionOptions): Promise<string> {
    const system = messages.find((m) => m.role === 'system')?.content || '';
    const chatMessages = messages.filter((m) => m.role !== 'system');

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: options?.model || 'claude-3-5-sonnet-20241022',
        max_tokens: options?.maxTokens || 4096,
        temperature: options?.temperature ?? 0.7,
        system,
        messages: chatMessages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const json = await response.json();
    return json.content?.[0]?.text || '';
  }

  countTokens(messages: LLMMessage[]): number {
    return messages.reduce((sum, m) => sum + Math.ceil(m.content.length / 4), 0);
  }
}
