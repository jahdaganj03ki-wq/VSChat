export type LearningCategory =
  'shell-command' | 'code-pattern' | 'api-usage' | 'platform-quirk' | 'user-preference';
export type Platform = 'windows' | 'macos' | 'linux' | 'all';
export type ShellType = 'powershell' | 'bash' | 'cmd' | 'zsh' | 'fish';
export type LearningSource = 'error' | 'user-edit' | 'explicit-feedback';

export interface KnowledgeEntry {
  id: string;
  category: LearningCategory;
  platform: Platform;
  shellType?: ShellType;
  triggerPattern: string;
  contextSignature: string;
  rule: string;
  correctApproach: string;
  confidence: number;
  source: LearningSource;
  createdAt: string;
  updatedAt: string;
  hitCount: number;
  lastUsed?: string;
}
