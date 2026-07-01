import * as fs from 'fs/promises';
import type { Tool, ToolResult } from '../ToolInterface';

export class FileReadTool implements Tool {
  readonly name = 'fileRead';
  readonly description = 'Read file contents from the filesystem';
  readonly requiresPermission = false;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const filePath = params.path as string;
    if (!filePath) {
      return { success: false, error: 'Missing required parameter: path' };
    }

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return { success: true, data: { content, path: filePath, size: content.length } };
    } catch (error) {
      return {
        success: false,
        error: `Failed to read file: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}
