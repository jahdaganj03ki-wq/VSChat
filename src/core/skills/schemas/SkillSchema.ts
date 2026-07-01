export interface SkillManifest {
  name: string;
  version: string;
  type: 'micro' | 'macro';
  description: string;
  triggers: string[];
  tags: string[];
  dependencies: string[];
  permissions: string[];
  instructions: string;
  source: string;
  author: string;
  improvements: string[];
}

export interface Skill {
  id: string;
  manifest: SkillManifest;
  localPath?: string;
  enabled: boolean;
  installedAt: Date;
}
