import type { SkillManifest } from '../schemas/SkillSchema';

interface CodexConfig {
  name?: string;
  description?: string;
  commands?: Array<{
    name: string;
    description?: string;
    prompt?: string;
  }>;
}

export class CodexAdapter {
  detect(path: string): boolean {
    return path.includes('.codex') || path.endsWith('codex.json');
  }

  convert(raw: string): SkillManifest | null {
    try {
      const config: CodexConfig = JSON.parse(raw);
      return {
        name: config.name || 'codex-import',
        version: '1.0.0',
        type: 'micro',
        description: config.description || 'Imported from Codex CLI',
        triggers: config.commands?.map((c) => c.name) || [],
        tags: ['codex', 'imported'],
        dependencies: [],
        permissions: ['file-read'],
        instructions: JSON.stringify(config.commands, null, 2),
        source: 'codex',
        author: 'codex-cli',
        improvements: [],
      };
    } catch {
      return null;
    }
  }
}
