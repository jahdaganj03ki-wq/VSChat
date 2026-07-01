export type ToolPermission = 'allow' | 'ask' | 'deny';

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface Tool {
  readonly name: string;
  readonly description: string;
  readonly requiresPermission: boolean;
  execute(params: Record<string, unknown>): Promise<ToolResult>;
}
