import type { ModeDefinition } from './ModeDefinitions';

export class ModePromptBuilder {
  buildSystemPrompt(mode: ModeDefinition, additionalContext: string[] = []): string {
    const parts: string[] = [mode.systemPrompt];

    if (additionalContext.length > 0) {
      parts.push('\n[ADDITIONAL CONTEXT]');
      parts.push(...additionalContext);
    }

    parts.push('\n[RESTRICTIONS]');
    if (mode.readonly) {
      parts.push('- READ-ONLY MODE: No file modifications allowed');
      parts.push('- No terminal commands that modify files');
      parts.push('- Only: read, search, analyze, and respond');
    }
    parts.push(`- Allowed tools: ${mode.allowedTools.join(', ')}`);
    parts.push(`- Mode: ${mode.name}`);

    return parts.join('\n');
  }
}
