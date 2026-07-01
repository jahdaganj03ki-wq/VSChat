import type { ModeDefinition } from './ModeDefinitions';

export type ToolPermission = 'allow' | 'ask' | 'deny';

export class ModePermissions {
  private overrides = new Map<string, ToolPermission>();

  constructor(private mode: ModeDefinition) {}

  getPermission(toolName: string): ToolPermission {
    const override = this.overrides.get(toolName);
    if (override) return override;

    if (this.mode.allowedTools.includes(toolName)) {
      return 'allow';
    }
    return 'deny';
  }

  setOverride(toolName: string, permission: ToolPermission): void {
    this.overrides.set(toolName, permission);
  }

  removeOverride(toolName: string): void {
    this.overrides.delete(toolName);
  }

  getAllowedTools(): string[] {
    return this.mode.allowedTools.filter((t) => this.getPermission(t) !== 'deny');
  }
}
