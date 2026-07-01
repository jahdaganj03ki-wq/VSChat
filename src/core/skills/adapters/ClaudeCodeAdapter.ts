import type { SkillManifest } from '../schemas/SkillSchema';

interface ClaudeCommand {
  name: string;
  description?: string;
  prompt?: string;
}

export class ClaudeCodeAdapter {
  detect(path: string): boolean {
    return path.includes('.claude') || path.endsWith('CLAUDE.md');
  }

  convertCommand(raw: string): SkillManifest | null {
    try {
      const command: ClaudeCommand = JSON.parse(raw);
      return {
        name: `claude-${command.name}`,
        version: '1.0.0',
        type: 'micro',
        description: command.description || `Claude Code command: ${command.name}`,
        triggers: [command.name],
        tags: ['claude', 'imported'],
        dependencies: [],
        permissions: ['file-read'],
        instructions: command.prompt || '',
        source: 'claude-code',
        author: 'claude-code',
        improvements: [],
      };
    } catch {
      return null;
    }
  }

  convertClaudeMd(content: string): SkillManifest {
    return {
      name: 'claude-md-instructions',
      version: '1.0.0',
      type: 'micro',
      description: 'CLAUDE.md project instructions',
      triggers: [],
      tags: ['claude', 'imported', 'instructions'],
      dependencies: [],
      permissions: ['file-read'],
      instructions: content,
      source: 'claude-code',
      author: 'project',
      improvements: [],
    };
  }
}
