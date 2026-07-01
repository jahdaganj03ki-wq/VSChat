import type { Skill } from './schemas/SkillSchema';
import { SkillMatcher } from './SkillMatcher';
import { SkillInstaller } from './SkillInstaller';
import { SkillRegistry } from './SkillRegistry';

export class SkillManager {
  private activeSkills: Skill[] = [];
  private matcher: SkillMatcher;
  private installer: SkillInstaller;
  private registry: SkillRegistry;

  constructor() {
    this.matcher = new SkillMatcher();
    this.installer = new SkillInstaller();
    this.registry = new SkillRegistry();
  }

  async matchAndInstall(prompt: string): Promise<Skill[]> {
    const matches = this.matcher.match(prompt, this.registry.getAll());
    const installed: Skill[] = [];

    for (const skill of matches) {
      if (!this.activeSkills.find((s) => s.id === skill.id)) {
        this.activeSkills.push(skill);
        installed.push(skill);
      }
    }

    return installed;
  }

  activate(skillId: string): boolean {
    const skill = this.activeSkills.find((s) => s.id === skillId);
    if (skill) {
      skill.enabled = true;
      return true;
    }
    return false;
  }

  deactivate(skillId: string): boolean {
    const skill = this.activeSkills.find((s) => s.id === skillId);
    if (skill) {
      skill.enabled = false;
      return true;
    }
    return false;
  }

  getActive(): Skill[] {
    return this.activeSkills.filter((s) => s.enabled);
  }

  getAll(): Skill[] {
    return this.activeSkills;
  }

  getRegistry(): SkillRegistry {
    return this.registry;
  }

  getMatcher(): SkillMatcher {
    return this.matcher;
  }
}
