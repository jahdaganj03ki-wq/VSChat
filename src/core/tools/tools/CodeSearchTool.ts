import type { Tool, ToolResult } from '../ToolInterface';

export class CodeSearchTool implements Tool {
  readonly name = 'codeSearch';
  readonly description = 'Search code using regex patterns';
  readonly requiresPermission = false;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const pattern = params.pattern as string;
    const include = params.include as string | undefined;

    if (!pattern) {
      return { success: false, error: 'Missing required parameter: pattern' };
    }

    try {
      const rg = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(rg.exec);

      const includeFlag = include ? `--include="${include}"` : '';
      const { stdout } = await execAsync(`rg --line-number ${includeFlag} "${pattern}"`, {
        maxBuffer: 10 * 1024 * 1024,
      });

      const lines = stdout.trim().split('\n').filter(Boolean);
      return { success: true, data: { results: lines, count: lines.length } };
    } catch (error: unknown) {
      const err = error as Error & { stdout?: string };
      if (err.stdout) {
        const lines = err.stdout.trim().split('\n').filter(Boolean);
        return { success: true, data: { results: lines, count: lines.length } };
      }
      return {
        success: false,
        error: `Code search failed: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}
