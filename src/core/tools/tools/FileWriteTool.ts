import * as fs from 'fs/promises';
import * as path from 'path';
import type { Tool, ToolResult } from '../ToolInterface';

export class FileWriteTool implements Tool {
  readonly name = 'fileWrite';
  readonly description = 'Create or overwrite a file';
  readonly requiresPermission = true;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const filePath = params.path as string;
    const content = params.content as string;

    if (!filePath || content === undefined) {
      return { success: false, error: 'Missing required parameters: path, content' };
    }

    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content, 'utf-8');
      return { success: true, data: { path: filePath, size: content.length } };
    } catch (error) {
      return {
        success: false,
        error: `Failed to write file: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}
