import type { Skill } from './schemas/SkillSchema';

export class SkillMatcher {
  match(prompt: string, available: Skill[]): Skill[] {
    const lowerPrompt = prompt.toLowerCase();
    const promptWords = new Set(lowerPrompt.split(/\s+/));

    const scored = available.map((skill) => {
      let score = 0;
      const triggers = skill.manifest.triggers.map((t) => t.toLowerCase());

      for (const trigger of triggers) {
        if (lowerPrompt.includes(trigger)) {
          score += 2;
        }
        if (promptWords.has(trigger)) {
          score += 3;
        }
      }

      for (const tag of skill.manifest.tags) {
        if (lowerPrompt.includes(tag.toLowerCase())) {
          score += 1;
        }
      }

      return { skill, score };
    });

    return scored
      .filter((s) => s.score > 2)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.skill);
  }
}
