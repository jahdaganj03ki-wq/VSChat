import type {
  LLMProvider,
  LLMMessage,
  LLMStreamEvent,
  LLMCompletionOptions,
} from '../LLMInterface';

export class GoogleGeminiProvider implements LLMProvider {
  readonly name = 'google-gemini';

  constructor(
    private apiKey: string,
    private model: string = 'gemini-1.5-pro',
  ) {}

  async *stream(
    messages: LLMMessage[],
    options?: LLMCompletionOptions,
  ): AsyncGenerator<LLMStreamEvent> {
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${options?.model || this.model}:streamGenerateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: options?.maxTokens || 8192,
          temperature: options?.temperature ?? 0.7,
        },
      }),
    });

    if (!response.ok) {
      yield { type: 'error', error: `Gemini error: ${response.status}` };
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
          if (!line.trim() || !line.startsWith('data: ')) continue;
          try {
            const json = JSON.parse(line.slice(6));
            const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) yield { type: 'token', content: text };
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
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${options?.model || this.model}:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    const json = await response.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  countTokens(messages: LLMMessage[]): number {
    return messages.reduce((sum, m) => sum + Math.ceil(m.content.length / 4), 0);
  }
}
