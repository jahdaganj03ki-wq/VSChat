import { KnowledgeStore } from './KnowledgeStore';
import type { KnowledgeEntry } from './schemas/KnowledgeSchema';

export class FeedbackIngester {
  constructor(private knowledgeStore: KnowledgeStore) {}

  processExplicitFeedback(
    messageId: string,
    feedback: 'thumbs_up' | 'thumbs_down',
    context: string,
  ): void {
    if (feedback === 'thumbs_down') {
      const entry: KnowledgeEntry = {
        id: crypto.randomUUID(),
        category: 'user-preference',
        platform: 'all',
        triggerPattern: context.slice(0, 100),
        contextSignature: 'explicit-feedback',
        rule: 'User did not like this response pattern',
        correctApproach: 'Adjust response style based on context',
        confidence: 0.5,
        source: 'explicit-feedback',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hitCount: 1,
        lastUsed: new Date().toISOString(),
      };
      this.knowledgeStore.insert(entry);
    }
  }
}
