import { z } from 'zod';

const PermissionLevel = z.enum(['allow', 'ask', 'deny']);

const ProviderSettings = z.object({
  apiKey: z.string().default(''),
  baseUrl: z.string().default(''),
  model: z.string().default(''),
  maxTokens: z.number().default(4096),
  temperature: z.number().min(0).max(2).default(0.7),
  topP: z.number().min(0).max(1).default(1),
  contextWindow: z.number().default(128000),
});

export const ConfigSchema = z.object({
  'apex.chat.fontSize': z.number().min(8).max(48).default(14),
  'apex.chat.theme': z.enum(['dark', 'light', 'high-contrast', 'custom']).default('dark'),
  'apex.chat.showLineNumbers': z.boolean().default(true),
  'apex.chat.autoScroll': z.boolean().default(true),
  'apex.chat.enterToSend': z.boolean().default(true),

  'apex.modes.default': z.enum(['plan', 'code']).default('plan'),
  'apex.modes.autoSwitch': z.boolean().default(false),
  'apex.modes.showConfirmation': z.boolean().default(true),
  'apex.modes.custom': z
    .array(
      z.object({
        name: z.string(),
        prompt: z.string(),
        tools: z.array(z.string()),
      }),
    )
    .default([]),
  'apex.modes.rememberLast': z.boolean().default(true),

  'apex.provider': z
    .enum([
      'openai',
      'anthropic',
      'ollama',
      'azure-openai',
      'google-gemini',
      'github-copilot',
      'openrouter',
      'nvidia-nim',
      'opencode-zen',
      'puter-ai',
    ])
    .default('openai'),

  'apex.providers.openai': ProviderSettings.extend({
    model: z.string().default('gpt-4o'),
    baseUrl: z.string().default('https://api.openai.com/v1'),
  }),
  'apex.providers.anthropic': ProviderSettings.extend({
    model: z.string().default('claude-3-5-sonnet-20241022'),
    baseUrl: z.string().default('https://api.anthropic.com/v1'),
    temperature: z.number().min(0).max(1).default(0.7),
    contextWindow: z.number().default(200000),
  }),
  'apex.providers.ollama': ProviderSettings.omit({ apiKey: true, topP: true }).extend({
    model: z.string().default('llama3'),
    baseUrl: z.string().default('http://localhost:11434'),
    contextWindow: z.number().default(8192),
  }),
  'apex.providers.azure-openai': ProviderSettings.extend({
    model: z.string().default('gpt-4o'),
    deploymentName: z.string().default(''),
    apiVersion: z.string().default('2024-10-01-preview'),
  }),
  'apex.providers.google-gemini': ProviderSettings.omit({ topP: true }).extend({
    model: z.string().default('gemini-1.5-pro'),
    contextWindow: z.number().default(1048576),
  }),
  'apex.providers.github-copilot': ProviderSettings.omit({
    baseUrl: true,
    temperature: true,
    topP: true,
  }),
  'apex.providers.openrouter': ProviderSettings.extend({
    baseUrl: z.string().default('https://openrouter.ai/api/v1'),
  }),
  'apex.providers.nvidia-nim': ProviderSettings.extend({
    model: z.string().default('nvidia/llama-3.1-nemotron-70b-instruct'),
    baseUrl: z.string().default('https://nim.ngc.nvidia.com'),
  }),
  'apex.providers.opencode-zen': ProviderSettings.omit({ temperature: true, topP: true }).extend({
    baseUrl: z.string().default('https://api.opencode.ai/v1'),
    model: z.string().default('zen-1.0'),
  }),
  'apex.providers.puter-ai': ProviderSettings.omit({ temperature: true, topP: true }).extend({
    baseUrl: z.string().default('https://api.puter.com/v1'),
  }),

  'apex.agentic.enabled': z.boolean().default(true),
  'apex.agentic.maxRequests': z.number().default(25),
  'apex.agentic.timeout': z.number().default(300),
  'apex.agentic.shellPath': z.string().default(''),
  'apex.agentic.tools.fileRead': PermissionLevel.default('allow'),
  'apex.agentic.tools.fileWrite': PermissionLevel.default('ask'),
  'apex.agentic.tools.fileEdit': PermissionLevel.default('ask'),
  'apex.agentic.tools.fileSearch': PermissionLevel.default('allow'),
  'apex.agentic.tools.terminalExec': PermissionLevel.default('ask'),
  'apex.agentic.tools.codeSearch': PermissionLevel.default('allow'),
  'apex.agentic.tools.webSearch': PermissionLevel.default('ask'),
  'apex.agentic.tools.webFetch': PermissionLevel.default('ask'),
  'apex.agentic.tools.globSearch': PermissionLevel.default('allow'),

  'apex.learning.enabled': z.boolean().default(true),
  'apex.learning.autoDetectPatterns': z.boolean().default(true),
  'apex.learning.learnFromEdits': z.boolean().default(true),
  'apex.learning.maxStoredRules': z.number().default(1000),
  'apex.learning.confidenceThreshold': z.number().min(0).max(1).default(0.7),
  'apex.learning.exportPath': z.string().default(''),

  'apex.subAgents.maxConcurrent': z.number().default(3),
  'apex.subAgents.defaultModel': z.string().default(''),
  'apex.subAgents.timeout': z.number().default(120),

  'apex.skills.autoInstall': z.boolean().default(true),
  'apex.skills.autoImprove': z.boolean().default(true),
  'apex.skills.maxActive': z.number().default(5),
  'apex.skills.github.enabled': z.boolean().default(true),
  'apex.skills.github.registryUrl': z.string().default('apex-skills/registry'),
  'apex.skills.github.autoDiscover': z.boolean().default(true),
  'apex.skills.github.searchTopics': z
    .array(z.string())
    .default(['apex-skill', 'claude-command', 'codex-agent', 'cursor-rule']),
  'apex.skills.github.token': z.string().default(''),
  'apex.skills.marketplaceUrl': z.string().default(''),
  'apex.skills.improvementMode': z
    .enum(['auto-apply', 'diff-review', 'off'])
    .default('diff-review'),
  'apex.skills.localPath': z.string().default(''),
  'apex.skills.sources.codex': z.boolean().default(true),
  'apex.skills.sources.claude': z.boolean().default(true),
  'apex.skills.sources.zcode': z.boolean().default(true),
  'apex.skills.sources.codexPath': z.string().default(''),
  'apex.skills.sources.claudePath': z.string().default(''),
  'apex.skills.sources.zcodePath': z.string().default(''),
  'apex.skills.sourceMode': z.enum(['import', 'live-adapter', 'both']).default('both'),

  'apex.advanced.customInstructions': z.string().default(''),
  'apex.advanced.autoSummarize': z.boolean().default(true),
  'apex.advanced.language': z.enum(['en', 'de', 'fr', 'es', 'ja', 'zh', 'pt']).default('en'),
  'apex.advanced.sounds': z.boolean().default(false),
  'apex.advanced.debugMode': z.boolean().default(false),
});

export type ApexConfig = z.infer<typeof ConfigSchema>;
export type PermissionLevel = z.infer<typeof PermissionLevel>;
