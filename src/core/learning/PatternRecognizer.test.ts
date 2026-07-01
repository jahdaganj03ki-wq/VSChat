import { describe, it, expect } from 'vitest';
import { PatternRecognizer } from './PatternRecognizer';

describe('PatternRecognizer', () => {
  const recognizer = new PatternRecognizer();

  it('should detect && in PowerShell', () => {
    const result = recognizer.analyzeError({
      command: 'npm install && npm test',
      exitCode: 1,
      errorOutput: '&& is not a recognized command',
      platform: 'windows',
      shellType: 'powershell',
    });

    expect(result).not.toBeNull();
    expect(result!.rule).toContain('&&');
    expect(result!.platform).toBe('windows');
    expect(result!.shellType).toBe('powershell');
    expect(result!.confidence).toBe(0.8);
  });

  it('should detect grep in PowerShell', () => {
    const result = recognizer.analyzeError({
      command: 'grep "pattern" file.txt',
      exitCode: 1,
      errorOutput: 'grep is not recognized',
      platform: 'windows',
      shellType: 'powershell',
    });

    expect(result).not.toBeNull();
    expect(result!.rule).toContain('Select-String');
  });

  it('should detect rm -rf in PowerShell', () => {
    const result = recognizer.analyzeError({
      command: 'rm -rf node_modules',
      exitCode: 1,
      errorOutput: 'rm: unknown option',
      platform: 'windows',
      shellType: 'powershell',
    });

    expect(result).not.toBeNull();
    expect(result!.correctApproach).toContain('Remove-Item');
  });

  it('should return null for non-matching commands', () => {
    const result = recognizer.analyzeError({
      command: 'npm run build',
      exitCode: 1,
      errorOutput: 'Module not found',
      platform: 'linux',
      shellType: 'bash',
    });

    expect(result).toBeNull();
  });

  it('should return null for bash-specific patterns on linux', () => {
    const result = recognizer.analyzeError({
      command: 'grep "pattern" file.txt',
      exitCode: 0,
      errorOutput: '',
      platform: 'linux',
      shellType: 'bash',
    });

    expect(result).toBeNull();
  });
});
