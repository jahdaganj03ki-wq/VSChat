import type {
  LLMProvider,
  LLMMessage,
  LLMStreamEvent,
  LLMCompletionOptions,
} from '../LLMInterface';

export class OllamaProvider implements LLMProvider {
  readonly name = 'ollama';

  constructor(private baseUrl: string = 'http://localhost:11434') {}

  async *stream(
    messages: LLMMessage[],
    options?: LLMCompletionOptions,
  ): AsyncGenerator<LLMStreamEvent> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options?.model || 'llama3',
        messages,
        stream: true,
        options: {
          temperature: options?.temperature ?? 0.7,
          num_predict: options?.maxTokens || 4096,
        },
      }),
    });

    if (!response.ok) {
      yield { type: 'error', error: `Ollama error: ${response.status}` };
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
          if (!line.trim()) continue;
          try {
            const json = JSON.parse(line);
            if (json.message?.content) {
              yield { type: 'token', content: json.message.content };
            }
            if (json.done) {
              yield { type: 'done' };
              return;
            }
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
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: options?.model || 'llama3',
        messages,
        options: {
          temperature: options?.temperature ?? 0.7,
          num_predict: options?.maxTokens || 4096,
        },
      }),
    });

    const json = await response.json();
    return json.message?.content || '';
  }

  countTokens(messages: LLMMessage[]): number {
    return messages.reduce((sum, m) => sum + Math.ceil(m.content.length / 4), 0);
  }
}
