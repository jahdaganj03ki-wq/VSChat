import type { SkillManifest } from './schemas/SkillSchema';

export class SkillAuthor {
  createManifest(
    name: string,
    description: string,
    triggers: string[],
    instructions: string,
  ): SkillManifest {
    return {
      name,
      version: '1.0.0',
      type: 'micro',
      description,
      triggers,
      tags: [],
      dependencies: [],
      permissions: ['file-read'],
      instructions,
      source: 'local',
      author: 'apex-agent',
      improvements: [],
    };
  }

  suggestImprovement(manifest: SkillManifest, suggestion: string): Partial<SkillManifest> {
    const improvement: Partial<SkillManifest> = {
      improvements: [...manifest.improvements, suggestion],
    };
    return improvement;
  }
}
