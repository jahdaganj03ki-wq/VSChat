export interface BusEvent {
  type: string;
  data: unknown;
  timestamp: Date;
}

type EventHandler = (event: BusEvent) => void;

export class AgentMessageBus {
  private handlers = new Map<string, Set<EventHandler>>();
  private history: BusEvent[] = [];

  on(eventType: string, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);
    return () => this.handlers.get(eventType)?.delete(handler);
  }

  publish(type: string, data: unknown): void {
    const event: BusEvent = { type, data, timestamp: new Date() };
    this.history.push(event);

    const handlers = this.handlers.get(type);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(event);
        } catch (e) {
          console.error(`MessageBus: handler error for ${type}:`, e);
        }
      }
    }
  }

  getHistory(): BusEvent[] {
    return [...this.history];
  }
}
