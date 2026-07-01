import type DatabaseConstructor from 'better-sqlite3';
import type { KnowledgeEntry } from './schemas/KnowledgeSchema';

export class KnowledgeStore {
  private db: DatabaseConstructor.Database;
  private cache: KnowledgeEntry[] = [];

  constructor(db: DatabaseConstructor.Database) {
    this.db = db;
    this.loadCache();
  }

  private loadCache(): void {
    const rows = this.db.prepare('SELECT * FROM knowledge ORDER BY confidence DESC').all() as Array<
      Record<string, unknown>
    >;
    this.cache = rows.map(this.rowToEntry);
  }

  private rowToEntry(row: Record<string, unknown>): KnowledgeEntry {
    return {
      id: row.id as string,
      category: row.category as KnowledgeEntry['category'],
      platform: row.platform as KnowledgeEntry['platform'],
      shellType: row.shell_type as KnowledgeEntry['shellType'],
      triggerPattern: row.trigger_pattern as string,
      contextSignature: row.context_signature as string,
      rule: row.rule as string,
      correctApproach: row.correct_approach as string,
      confidence: row.confidence as number,
      source: row.source as KnowledgeEntry['source'],
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      hitCount: row.hit_count as number,
      lastUsed: row.last_used as string | undefined,
    };
  }

  insert(entry: KnowledgeEntry): void {
    this.db
      .prepare(
        `INSERT INTO knowledge (id, category, platform, shell_type, trigger_pattern, context_signature, rule, correct_approach, confidence, source, created_at, updated_at, hit_count)
         VALUES (@id, @category, @platform, @shellType, @triggerPattern, @contextSignature, @rule, @correctApproach, @confidence, @source, @createdAt, @updatedAt, @hitCount)`,
      )
      .run(entry);
    this.cache.push(entry);
  }

  update(entry: KnowledgeEntry): void {
    this.db
      .prepare(
        `UPDATE knowledge SET confidence = @confidence, hit_count = @hitCount, last_used = @lastUsed, updated_at = @updatedAt
         WHERE id = @id`,
      )
      .run(entry);
    const idx = this.cache.findIndex((e) => e.id === entry.id);
    if (idx >= 0) this.cache[idx] = entry;
  }

  findByContext(platform: string, shellType?: string): KnowledgeEntry[] {
    return this.cache.filter(
      (e) =>
        (e.platform === platform || e.platform === 'all') &&
        (!shellType || e.shellType === shellType || !e.shellType),
    );
  }

  findByPattern(pattern: string): KnowledgeEntry[] {
    return this.cache.filter((e) => e.triggerPattern === pattern);
  }

  getAll(): KnowledgeEntry[] {
    return [...this.cache];
  }

  delete(id: string): void {
    this.db.prepare('DELETE FROM knowledge WHERE id = ?').run(id);
    this.cache = this.cache.filter((e) => e.id !== id);
  }

  getCount(): number {
    return this.cache.length;
  }

  getRelevantRules(contextSignature: string, maxRules = 5): KnowledgeEntry[] {
    return this.cache
      .filter((e) => e.contextSignature === contextSignature)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxRules);
  }
}
