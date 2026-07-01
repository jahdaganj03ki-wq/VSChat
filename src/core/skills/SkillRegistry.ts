import type { Skill } from './schemas/SkillSchema';

export class SkillRegistry {
  private cache: Skill[] = [];

  getAll(): Skill[] {
    return [...this.cache];
  }

  add(skill: Skill): void {
    const existing = this.cache.findIndex((s) => s.id === skill.id);
    if (existing >= 0) {
      this.cache[existing] = skill;
    } else {
      this.cache.push(skill);
    }
  }

  remove(skillId: string): void {
    this.cache = this.cache.filter((s) => s.id !== skillId);
  }

  findByName(name: string): Skill | undefined {
    return this.cache.find((s) => s.manifest.name === name);
  }

  getCount(): number {
    return this.cache.length;
  }
}
