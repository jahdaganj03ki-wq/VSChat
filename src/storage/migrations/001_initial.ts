import type DatabaseConstructor from 'better-sqlite3';

export function up(db: DatabaseConstructor.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.prepare('INSERT OR IGNORE INTO schema_version (version) VALUES (1)').run();
}

export function down(db: DatabaseConstructor.Database): void {
  db.exec('DROP TABLE IF EXISTS schema_version');
}
