import type { LLMMessage } from '../llm/LLMInterface';

export interface Conversation {
  id: string;
  title: string;
  mode: string;
  persona: string;
  messages: LLMMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export class ConversationManager {
  private conversations = new Map<string, Conversation>();
  private activeId: string | null = null;

  create(title = 'New Conversation', mode = 'plan', persona = 'expert-developer'): Conversation {
    const conversation: Conversation = {
      id: crypto.randomUUID(),
      title,
      mode,
      persona,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.set(conversation.id, conversation);
    this.activeId = conversation.id;
    return conversation;
  }

  getActive(): Conversation | undefined {
    if (!this.activeId) return undefined;
    return this.conversations.get(this.activeId);
  }

  get(id: string): Conversation | undefined {
    return this.conversations.get(id);
  }

  addMessage(id: string, message: LLMMessage): void {
    const conv = this.conversations.get(id);
    if (conv) {
      conv.messages.push(message);
      conv.updatedAt = new Date();
    }
  }

  getAll(): Conversation[] {
    return Array.from(this.conversations.values()).sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
    );
  }

  delete(id: string): void {
    this.conversations.delete(id);
    if (this.activeId === id) {
      this.activeId = null;
    }
  }

  setActive(id: string): void {
    if (this.conversations.has(id)) {
      this.activeId = id;
    }
  }
}
