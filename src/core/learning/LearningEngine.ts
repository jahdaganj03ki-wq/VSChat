import { PatternRecognizer } from './PatternRecognizer';
import { KnowledgeStore } from './KnowledgeStore';
import { FeedbackIngester } from './FeedbackIngester';
import { ContextRetriever } from './ContextRetriever';
import type { KnowledgeEntry, Platform, ShellType } from './schemas/KnowledgeSchema';

export class LearningEngine {
  private patternRecognizer: PatternRecognizer;
  private knowledgeStore: KnowledgeStore;
  private feedbackIngester: FeedbackIngester;
  private contextRetriever: ContextRetriever;

  constructor(knowledgeStore: KnowledgeStore) {
    this.patternRecognizer = new PatternRecognizer();
    this.knowledgeStore = knowledgeStore;
    this.feedbackIngester = new FeedbackIngester(knowledgeStore);
    this.contextRetriever = new ContextRetriever(knowledgeStore);
  }

  processError(
    command: string,
    errorOutput: string,
    exitCode: number | null,
    platform: Platform,
    shellType: ShellType,
  ): KnowledgeEntry | null {
    const entry = this.patternRecognizer.analyzeError({
      command,
      exitCode,
      errorOutput,
      platform,
      shellType,
    });

    if (entry) {
      const existing = this.knowledgeStore.findByPattern(entry.triggerPattern);
      if (existing.length === 0) {
        this.knowledgeStore.insert(entry);
        return entry;
      }
    }

    return null;
  }

  getRelevantRules(): string {
    return this.contextRetriever.getRelevantRulesAsPrompt('current');
  }

  getStats(): { totalRules: number; byPlatform: Record<string, number> } {
    const rules = this.knowledgeStore.getAll();
    const byPlatform: Record<string, number> = {};

    for (const rule of rules) {
      byPlatform[rule.platform] = (byPlatform[rule.platform] || 0) + 1;
    }

    return {
      totalRules: rules.length,
      byPlatform,
    };
  }

  getPatternRecognizer(): PatternRecognizer {
    return this.patternRecognizer;
  }

  getFeedbackIngester(): FeedbackIngester {
    return this.feedbackIngester;
  }

  getContextRetriever(): ContextRetriever {
    return this.contextRetriever;
  }
}
