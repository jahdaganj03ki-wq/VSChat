import type { LLMProvider, LLMMessage } from '../llm/LLMInterface';

export interface ChatSession {
  id: string;
  messages: LLMMessage[];
  provider: LLMProvider;
  onToken: (token: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

export class ChatEngine {
  private sessions = new Map<string, ChatSession>();
  private abortControllers = new Map<string, AbortController>();

  createSession(session: ChatSession): void {
    this.sessions.set(session.id, session);
  }

  async sendMessage(sessionId: string, content: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    session.messages.push({ role: 'user', content });

    const controller = new AbortController();
    this.abortControllers.set(sessionId, controller);

    try {
      const stream = session.provider.stream(session.messages);
      for await (const event of stream) {
        if (controller.signal.aborted) break;

        switch (event.type) {
          case 'token':
            session.onToken(event.content || '');
            break;
          case 'done':
            session.onDone();
            break;
          case 'error':
            session.onError(event.error || 'Unknown error');
            break;
        }
      }
    } catch (error) {
      session.onError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      this.abortControllers.delete(sessionId);
    }
  }

  cancelSession(sessionId: string): void {
    const controller = this.abortControllers.get(sessionId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(sessionId);
    }
  }

  deleteSession(sessionId: string): void {
    this.cancelSession(sessionId);
    this.sessions.delete(sessionId);
  }
}
