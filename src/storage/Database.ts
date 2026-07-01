import * as vscode from 'vscode';
import DatabaseConstructor from 'better-sqlite3';

export class Database {
  private static instance: Database;
  private db: DatabaseConstructor.Database | null = null;
  private context: vscode.ExtensionContext;

  private constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  static getInstance(context: vscode.ExtensionContext): Database {
    if (!Database.instance) {
      Database.instance = new Database(context);
    }
    return Database.instance;
  }

  initialize(): void {
    const dbPath = vscode.Uri.joinPath(this.context.globalStorageUri, 'apex-agent.db').fsPath;

    this.db = new DatabaseConstructor(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.runMigrations();
  }

  getConnection(): DatabaseConstructor.Database {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  private runMigrations(): void {
    const db = this.getConnection();

    db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        applied_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL DEFAULT 'Untitled',
        persona TEXT NOT NULL DEFAULT 'expert-developer',
        mode TEXT NOT NULL DEFAULT 'plan',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system', 'tool')),
        content TEXT NOT NULL,
        provider TEXT,
        model TEXT,
        tokens_in INTEGER DEFAULT 0,
        tokens_out INTEGER DEFAULT 0,
        feedback TEXT CHECK(feedback IN ('thumbs_up', 'thumbs_down', NULL)),
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS knowledge (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL CHECK(category IN ('shell-command', 'code-pattern', 'api-usage', 'platform-quirk', 'user-preference')),
        platform TEXT NOT NULL CHECK(platform IN ('windows', 'macos', 'linux', 'all')),
        shell_type TEXT CHECK(shell_type IN ('powershell', 'bash', 'cmd', 'zsh', 'fish', NULL)),
        trigger_pattern TEXT NOT NULL,
        context_signature TEXT NOT NULL,
        rule TEXT NOT NULL,
        correct_approach TEXT NOT NULL,
        confidence REAL NOT NULL DEFAULT 0.5,
        source TEXT NOT NULL CHECK(source IN ('error', 'user-edit', 'explicit-feedback')),
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        hit_count INTEGER NOT NULL DEFAULT 0,
        last_used TEXT
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS skills (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        version TEXT NOT NULL DEFAULT '1.0.0',
        type TEXT NOT NULL CHECK(type IN ('micro', 'macro')),
        description TEXT NOT NULL DEFAULT '',
        source TEXT NOT NULL DEFAULT 'local',
        local_path TEXT,
        enabled INTEGER NOT NULL DEFAULT 1,
        installed_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS skill_triggers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        skill_id TEXT NOT NULL,
        trigger TEXT NOT NULL,
        FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS skill_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        skill_id TEXT NOT NULL,
        tag TEXT NOT NULL,
        FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
      )
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id)
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_knowledge_context ON knowledge(context_signature)
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_knowledge_platform ON knowledge(platform, shell_type)
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name)
    `);

    db.exec(`
      INSERT OR IGNORE INTO migrations (name) VALUES ('initial_schema')
    `);
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}
