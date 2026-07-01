import type {
  KnowledgeEntry,
  LearningCategory,
  Platform,
  ShellType,
} from './schemas/KnowledgeSchema';

interface ErrorContext {
  command: string;
  exitCode: number | null;
  errorOutput: string;
  platform: Platform;
  shellType: ShellType;
}

const BUILTIN_PATTERNS: Array<{
  pattern: RegExp;
  category: LearningCategory;
  platform: Platform;
  shellType: ShellType;
  rule: string;
  correctApproach: string;
}> = [
  {
    pattern: /&&/,
    category: 'shell-command',
    platform: 'windows',
    shellType: 'powershell',
    rule: "Use ';' not '&&' in PowerShell",
    correctApproach:
      "In PowerShell, use ';' to chain commands or 'if ($?) { cmd }' for conditional execution",
  },
  {
    pattern: /\|\|/,
    category: 'shell-command',
    platform: 'windows',
    shellType: 'powershell',
    rule: "Use 'if (-not $?)' not '||' in PowerShell",
    correctApproach: "In PowerShell, use 'if (-not $?) { cmd }' instead of '||'",
  },
  {
    pattern: /grep/,
    category: 'shell-command',
    platform: 'windows',
    shellType: 'powershell',
    rule: "Use 'Select-String' not 'grep' in PowerShell",
    correctApproach: "In PowerShell, use 'Select-String' instead of 'grep'",
  },
  {
    pattern: /rm\s+-rf/,
    category: 'shell-command',
    platform: 'windows',
    shellType: 'powershell',
    rule: "Use 'Remove-Item -Recurse -Force' not 'rm -rf' in PowerShell",
    correctApproach: "In PowerShell, use 'Remove-Item -Recurse -Force' instead of 'rm -rf'",
  },
  {
    pattern: /wget/,
    category: 'shell-command',
    platform: 'windows',
    shellType: 'powershell',
    rule: "Use 'Invoke-WebRequest' not 'wget' in PowerShell",
    correctApproach: "In PowerShell, use 'Invoke-WebRequest -Uri <url>' instead of 'wget'",
  },
  {
    pattern: /curl/,
    category: 'shell-command',
    platform: 'windows',
    shellType: 'powershell',
    rule: "Use 'Invoke-WebRequest' or 'curl.exe' not 'curl' in PowerShell",
    correctApproach:
      "In PowerShell, 'curl' is an alias for 'Invoke-WebRequest'. Use 'curl.exe' for the real curl",
  },
  {
    pattern: /cat\s+/,
    category: 'shell-command',
    platform: 'windows',
    shellType: 'powershell',
    rule: "Use 'Get-Content' not 'cat' in PowerShell",
    correctApproach: "In PowerShell, use 'Get-Content <file>' instead of 'cat'",
  },
  {
    pattern: /\\\//,
    category: 'shell-command',
    platform: 'windows',
    shellType: 'powershell',
    rule: 'Use backslashes for Windows paths',
    correctApproach: 'In PowerShell on Windows, use backslashes (\\ or \\) for file paths',
  },
  {
    pattern: /touch\s+/,
    category: 'shell-command',
    platform: 'windows',
    shellType: 'powershell',
    rule: "Use 'New-Item' not 'touch' in PowerShell",
    correctApproach: "In PowerShell, use 'New-Item -ItemType File <path>' instead of 'touch'",
  },
  {
    pattern: /chmod/,
    category: 'shell-command',
    platform: 'windows',
    shellType: 'powershell',
    rule: 'chmod is not available on Windows',
    correctApproach: 'Windows uses ACLs via icacls.exe, not chmod',
  },
];

export class PatternRecognizer {
  private learnedPatterns: KnowledgeEntry[] = [];

  analyzeError(context: ErrorContext): KnowledgeEntry | null {
    for (const builtin of BUILTIN_PATTERNS) {
      if (builtin.pattern.test(context.command) || builtin.pattern.test(context.errorOutput)) {
        if (builtin.platform === context.platform || builtin.platform === 'all') {
          if (builtin.shellType === context.shellType) {
            return this.createEntry(builtin, context);
          }
        }
      }
    }

    return null;
  }

  private createEntry(
    pattern: (typeof BUILTIN_PATTERNS)[0],
    context: ErrorContext,
  ): KnowledgeEntry {
    return {
      id: crypto.randomUUID(),
      category: pattern.category,
      platform: context.platform,
      shellType: context.shellType,
      triggerPattern: pattern.pattern.source,
      contextSignature: `${context.platform}:${context.shellType}`,
      rule: pattern.rule,
      correctApproach: pattern.correctApproach,
      confidence: 0.8,
      source: 'error',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      hitCount: 0,
    };
  }

  addLearnedPattern(entry: KnowledgeEntry): void {
    this.learnedPatterns.push(entry);
  }

  getBuiltinPatterns(): typeof BUILTIN_PATTERNS {
    return [...BUILTIN_PATTERNS];
  }
}
