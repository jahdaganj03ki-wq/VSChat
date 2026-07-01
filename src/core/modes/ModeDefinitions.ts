import { z } from 'zod';

export const ModeDefinitionSchema = z.object({
  name: z.string().min(1).max(50),
  label: z.string().min(1).max(50),
  description: z.string().default(''),
  systemPrompt: z.string(),
  allowedTools: z.array(z.string()),
  readonly: z.boolean().default(false),
  color: z.string().default('#3b82f6'),
  icon: z.string().default('\u{1F9E0}'),
});

export type ModeDefinition = z.infer<typeof ModeDefinitionSchema>;

export const BUILTIN_MODES: ModeDefinition[] = [
  {
    name: 'plan',
    label: 'Plan Mode',
    description: 'Analysis, architecture, design discussion - read-only',
    systemPrompt: `You are ApexAgent in PLAN MODE.
Your focus is on analysis, architecture, design discussion, and risk assessment.

AVAILABLE TOOLS: read-only tools (file-read, grep, glob, search, web-fetch, question)
RESTRICTED: No write operations, no file edits, no terminal execution

BEHAVIOR:
- Ask clarifying questions before proceeding
- Explore the codebase thoroughly
- Provide Markdown-formatted plans and architecture decisions
- Identify risks and alternative approaches
- Output: Plans, decision documents, architecture sketches`,
    allowedTools: ['fileRead', 'codeSearch', 'globSearch', 'webFetch', 'question'],
    readonly: true,
    color: '#3b82f6',
    icon: '\u{1F9E0}',
  },
  {
    name: 'code',
    label: 'Code Mode',
    description: 'Implementation, concrete changes, efficiency - full access',
    systemPrompt: `You are ApexAgent in CODE MODE.
Your focus is on implementation, concrete code changes, and efficiency.

AVAILABLE TOOLS: All tools (read + write + execute + terminal)
FULL ACCESS: File write, edit, terminal execution, all tools

BEHAVIOR:
- Action-oriented: implement directly
- Produce concrete, working code
- Use all available tools to complete the task
- Output: Code changes, file operations, directly actionable results`,
    allowedTools: [
      'fileRead',
      'fileWrite',
      'fileEdit',
      'fileSearch',
      'terminalExec',
      'codeSearch',
      'webSearch',
      'webFetch',
      'globSearch',
    ],
    readonly: false,
    color: '#22c55e',
    icon: '\u26A1',
  },
];

export function getBuiltinMode(name: string): ModeDefinition | undefined {
  return BUILTIN_MODES.find((m) => m.name === name);
}

export function getAllBuiltinModes(): ModeDefinition[] {
  return [...BUILTIN_MODES];
}
