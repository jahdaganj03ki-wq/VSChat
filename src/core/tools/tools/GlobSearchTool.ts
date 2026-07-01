import { globSync } from 'glob';
import type { Tool, ToolResult } from '../ToolInterface';

export class GlobSearchTool implements Tool {
  readonly name = 'globSearch';
  readonly description = 'Search files using glob patterns';
  readonly requiresPermission = false;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const pattern = params.pattern as string;
    if (!pattern) {
      return { success: false, error: 'Missing required parameter: pattern' };
    }

    try {
      const results = globSync(pattern, { dot: true });
      return { success: true, data: { files: results, count: results.length } };
    } catch (error) {
      return {
        success: false,
        error: `Glob search failed: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}
