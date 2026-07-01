import type { Skill, SkillManifest } from './schemas/SkillSchema';

export class SkillInstaller {
  async installFromGithub(repoUrl: string): Promise<Skill | null> {
    try {
      const response = await fetch(`https://api.github.com/repos/${repoUrl}/contents/skill.json`);
      if (!response.ok) return null;

      const data = await response.json();
      const content = atob(data.content);
      const manifest: SkillManifest = JSON.parse(content);

      return {
        id: `${manifest.name}@${manifest.version}`,
        manifest,
        enabled: true,
        installedAt: new Date(),
      };
    } catch {
      return null;
    }
  }

  async installFromLocal(path: string, manifest: SkillManifest): Promise<Skill> {
    return {
      id: `${manifest.name}@${manifest.version}`,
      manifest,
      localPath: path,
      enabled: true,
      installedAt: new Date(),
    };
  }
}
