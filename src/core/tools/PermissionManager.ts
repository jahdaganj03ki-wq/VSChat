import type { ToolPermission } from './ToolInterface';

export class PermissionManager {
  private permissions = new Map<string, ToolPermission>();
  private globalDefault: ToolPermission = 'ask';

  setGlobalDefault(permission: ToolPermission): void {
    this.globalDefault = permission;
  }

  set(toolName: string, permission: ToolPermission): void {
    this.permissions.set(toolName, permission);
  }

  get(toolName: string): ToolPermission {
    return this.permissions.get(toolName) || this.globalDefault;
  }

  remove(toolName: string): void {
    this.permissions.delete(toolName);
  }

  getAll(): Record<string, ToolPermission> {
    const result: Record<string, ToolPermission> = {};
    for (const [key, value] of this.permissions) {
      result[key] = value;
    }
    return result;
  }
}
