import * as fs from 'fs/promises';
import type { Tool, ToolResult } from '../ToolInterface';

export class FileEditTool implements Tool {
  readonly name = 'fileEdit';
  readonly description = 'Search and replace text in a file';
  readonly requiresPermission = true;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const filePath = params.path as string;
    const oldString = params.oldString as string;
    const newString = params.newString as string;

    if (!filePath || oldString === undefined || newString === undefined) {
      return { success: false, error: 'Missing required parameters: path, oldString, newString' };
    }

    try {
      const content = await fs.readFile(filePath, 'utf-8');

      if (!content.includes(oldString)) {
        return { success: false, error: `oldString not found in ${filePath}` };
      }

      const updated = content.replace(oldString, newString);
      await fs.writeFile(filePath, updated, 'utf-8');

      return { success: true, data: { path: filePath, replaced: 1 } };
    } catch (error) {
      return {
        success: false,
        error: `Failed to edit file: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}
