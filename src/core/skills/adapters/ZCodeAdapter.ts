import type { SkillManifest } from '../schemas/SkillSchema';

interface ZCodeConfig {
  workspace?: {
    name?: string;
    description?: string;
  };
  tasks?: Array<{
    name: string;
    prompt?: string;
    model?: string;
  }>;
}

export class ZCodeAdapter {
  detect(path: string): boolean {
    return path.includes('.zcode') || path.endsWith('zcode.json');
  }

  convert(raw: string): SkillManifest | null {
    try {
      const config: ZCodeConfig = JSON.parse(raw);
      return {
        name: `zcode-${config.workspace?.name || 'import'}`,
        version: '1.0.0',
        type: config.tasks && config.tasks.length > 1 ? 'macro' : 'micro',
        description: config.workspace?.description || 'Imported from ZCode',
        triggers: config.tasks?.map((t) => t.name) || [],
        tags: ['zcode', 'imported'],
        dependencies: [],
        permissions: ['file-read'],
        instructions: JSON.stringify(config.tasks, null, 2),
        source: 'zcode',
        author: 'zcode-desktop',
        improvements: [],
      };
    } catch {
      return null;
    }
  }
}
