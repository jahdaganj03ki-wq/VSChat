import { DEFAULT_CONFIG } from './defaults';

const MIGRATIONS: Array<{
  version: number;
  migrate: (config: Record<string, unknown>) => Record<string, unknown>;
}> = [
  {
    version: 1,
    migrate: (config) => ({
      ...config,
      ...DEFAULT_CONFIG,
    }),
  },
];

export class ConfigMigration {
  getCurrentVersion(): number {
    return MIGRATIONS.length;
  }

  run(config: Record<string, unknown>, fromVersion = 0): Record<string, unknown> {
    let migrated = { ...config };

    for (const migration of MIGRATIONS) {
      if (migration.version > fromVersion) {
        migrated = migration.migrate(migrated);
      }
    }

    return migrated;
  }
}
