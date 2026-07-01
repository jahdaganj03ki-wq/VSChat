import type { Persona } from './PersonaManager';
import type { ModeDefinition } from '../modes/ModeDefinitions';
import type { Skill } from '../skills/schemas/SkillSchema';

export class SystemPromptBuilder {
  build(
    persona: Persona,
    mode: ModeDefinition,
    skills: Skill[] = [],
    learnedRules = '',
    customInstructions = '',
  ): string {
    const parts: string[] = [];

    if (persona.systemPrompt) {
      parts.push(persona.systemPrompt);
    }

    parts.push(`\n[MODE: ${mode.label}]`);
    parts.push(mode.systemPrompt);

    if (skills.length > 0) {
      parts.push('\n[ACTIVE SKILLS]');
      for (const skill of skills) {
        if (skill.enabled) {
          parts.push(
            `- ${skill.manifest.name} v${skill.manifest.version}: ${skill.manifest.description}`,
          );
          if (skill.manifest.instructions) {
            parts.push(`  Instructions: ${skill.manifest.instructions}`);
          }
        }
      }
    }

    if (learnedRules) {
      parts.push(learnedRules);
    }

    if (customInstructions) {
      parts.push('\n[CUSTOM INSTRUCTIONS]');
      parts.push(customInstructions);
    }

    return parts.join('\n');
  }
}
