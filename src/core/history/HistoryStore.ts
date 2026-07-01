import type DatabaseConstructor from 'better-sqlite3';

export interface HistoryEntry {
  id: string;
  title: string;
  persona: string;
  mode: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export class HistoryStore {
  private db: DatabaseConstructor.Database;

  constructor(db: DatabaseConstructor.Database) {
    this.db = db;
  }

  getAll(limit = 50, offset = 0): HistoryEntry[] {
    return this.db
      .prepare(
        `SELECT c.id, c.title, c.persona, c.mode,
                (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id) as messageCount,
                c.created_at, c.updated_at
         FROM conversations c
         ORDER BY c.updated_at DESC
         LIMIT ? OFFSET ?`,
      )
      .all(limit, offset) as HistoryEntry[];
  }

  search(query: string): HistoryEntry[] {
    return this.db
      .prepare(
        `SELECT DISTINCT c.id, c.title, c.persona, c.mode,
                (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id) as messageCount,
                c.created_at, c.updated_at
         FROM conversations c
         LEFT JOIN messages m ON m.conversation_id = c.id
         WHERE c.title LIKE ? OR m.content LIKE ?
         ORDER BY c.updated_at DESC
         LIMIT 50`,
      )
      .all(`%${query}%`, `%${query}%`) as HistoryEntry[];
  }

  delete(id: string): void {
    this.db.prepare('DELETE FROM messages WHERE conversation_id = ?').run(id);
    this.db.prepare('DELETE FROM conversations WHERE id = ?').run(id);
  }

  getCount(): number {
    const row = this.db.prepare('SELECT COUNT(*) as count FROM conversations').get() as {
      count: number;
    };
    return row.count;
  }
}
