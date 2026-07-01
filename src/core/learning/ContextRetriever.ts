import { KnowledgeStore } from './KnowledgeStore';
import type { KnowledgeEntry } from './schemas/KnowledgeSchema';

export class ContextRetriever {
  constructor(private knowledgeStore: KnowledgeStore) {}

  getRelevantRules(contextSignature: string, maxRules = 5): KnowledgeEntry[] {
    return this.knowledgeStore.getRelevantRules(contextSignature, maxRules);
  }

  getRelevantRulesAsPrompt(contextSignature: string): string {
    const rules = this.getRelevantRules(contextSignature);

    if (rules.length === 0) return '';

    const parts = rules.map(
      (r) =>
        `- [${r.category}] ${r.rule}: ${r.correctApproach} (confidence: ${(r.confidence * 100).toFixed(0)}%)`,
    );

    return `
[LEARNED RULES]
The following rules were learned from previous errors and feedback:
${parts.join('\n')}

These rules should be followed to avoid repeating past mistakes.
`;
  }
}
