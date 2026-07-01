import type { Tool, ToolPermission } from './ToolInterface';

export class ToolRegistry {
  private tools = new Map<string, Tool>();
  private permissions = new Map<string, ToolPermission>();

  register(tool: Tool): void {
    this.tools.set(tool.name, tool);
    this.permissions.set(tool.name, tool.requiresPermission ? 'ask' : 'allow');
  }

  get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  getPermission(name: string): ToolPermission {
    return this.permissions.get(name) || 'deny';
  }

  setPermission(name: string, permission: ToolPermission): void {
    this.permissions.set(name, permission);
  }

  getAll(): Tool[] {
    return Array.from(this.tools.values());
  }

  getNames(): string[] {
    return Array.from(this.tools.keys());
  }
}
