import type { LLMMessage } from '../llm/LLMInterface';

interface StoredMessage extends LLMMessage {
  id: string;
  timestamp: Date;
  tokensIn: number;
  tokensOut: number;
  feedback?: 'thumbs_up' | 'thumbs_down';
}

export class MessageStore {
  private messages = new Map<string, StoredMessage[]>();

  add(conversationId: string, message: LLMMessage): StoredMessage {
    const stored: StoredMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      tokensIn: 0,
      tokensOut: 0,
    };

    if (!this.messages.has(conversationId)) {
      this.messages.set(conversationId, []);
    }
    this.messages.get(conversationId)!.push(stored);
    return stored;
  }

  getMessages(conversationId: string): StoredMessage[] {
    return this.messages.get(conversationId) || [];
  }

  setFeedback(messageId: string, feedback: 'thumbs_up' | 'thumbs_down'): void {
    for (const messages of this.messages.values()) {
      const msg = messages.find((m) => m.id === messageId);
      if (msg) {
        msg.feedback = feedback;
        break;
      }
    }
  }

  deleteConversation(conversationId: string): void {
    this.messages.delete(conversationId);
  }
}
