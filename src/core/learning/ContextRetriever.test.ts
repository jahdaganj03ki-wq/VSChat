import { describe, it, expect, beforeEach } from 'vitest';
import { ContextRetriever } from './ContextRetriever';
import type { KnowledgeEntry } from './schemas/KnowledgeSchema';

class MockKnowledgeStore {
  private entries: KnowledgeEntry[] = [];

  getRelevantRules(contextSignature: string, maxRules = 5): KnowledgeEntry[] {
    return this.entries
      .filter((e) => e.contextSignature === contextSignature)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxRules);
  }

  insert(entry: KnowledgeEntry): void {
    this.entries.push(entry);
  }

  getAll(): KnowledgeEntry[] {
    return [...this.entries];
  }
}

describe('ContextRetriever', () => {
  let store: MockKnowledgeStore;
  let retriever: ContextRetriever;

  beforeEach(() => {
    store = new MockKnowledgeStore();
    retriever = new ContextRetriever(store as any);

    const entries: KnowledgeEntry[] = [
      {
        id: '1',
        category: 'shell-command',
        platform: 'windows',
        shellType: 'powershell',
        triggerPattern: '&&',
        contextSignature: 'windows:powershell',
        rule: "Use ';' not '&&'",
        correctApproach: "In PowerShell, use ';' to chain commands",
        confidence: 0.9,
        source: 'error',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hitCount: 3,
        lastUsed: new Date().toISOString(),
      },
      {
        id: '2',
        category: 'code-pattern',
        platform: 'all',
        triggerPattern: 'cb()',
        contextSignature: 'general',
        rule: 'Use process.exit(1)',
        correctApproach: 'Replace cb() with process.exit(1)',
        confidence: 0.6,
        source: 'user-edit',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hitCount: 1,
      },
    ];

    for (const entry of entries) {
      store.insert(entry);
    }
  });

  it('should retrieve relevant rules for context', () => {
    const rules = retriever.getRelevantRules('windows:powershell');
    expect(rules.length).toBe(1);
    expect(rules[0].rule).toContain('&&');
    expect(rules[0].confidence).toBe(0.9);
  });

  it('should limit rules by maxRules', () => {
    const rules = retriever.getRelevantRules('general', 5);
    expect(rules.length).toBe(1);
  });

  it('should build prompt from rules', () => {
    const prompt = retriever.getRelevantRulesAsPrompt('windows:powershell');
    expect(prompt).toContain('[LEARNED RULES]');
    expect(prompt).toContain('&&');
  });

  it('should return empty for unknown context', () => {
    const rules = retriever.getRelevantRules('macos:zsh');
    expect(rules.length).toBe(0);
  });
});
