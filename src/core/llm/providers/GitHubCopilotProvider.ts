import type {
  LLMProvider,
  LLMMessage,
  LLMStreamEvent,
  LLMCompletionOptions,
} from '../LLMInterface';

export class GitHubCopilotProvider implements LLMProvider {
  readonly name = 'github-copilot';

  constructor(private token: string) {}

  async *stream(
    messages: LLMMessage[],
    options?: LLMCompletionOptions,
  ): AsyncGenerator<LLMStreamEvent> {
    const response = await fetch('https://api.githubcopilot.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
        'Editor-Version': 'vscode/1.90.0',
        'User-Agent': 'ApexAgent/0.1.0',
      },
      body: JSON.stringify({
        model: options?.model || 'gpt-4o-copilot',
        messages,
        max_tokens: options?.maxTokens || 4096,
        stream: true,
      }),
    });

    if (!response.ok) {
      yield { type: 'error', error: `GitHub Copilot error: ${response.status}` };
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
    const response = await fetch('https://api.githubcopilot.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
        'Editor-Version': 'vscode/1.90.0',
        'User-Agent': 'ApexAgent/0.1.0',
      },
      body: JSON.stringify({
        model: options?.model || 'gpt-4o-copilot',
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
