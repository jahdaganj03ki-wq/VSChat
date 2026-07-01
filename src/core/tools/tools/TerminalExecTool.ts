import { exec } from 'child_process';
import { promisify } from 'util';
import type { Tool, ToolResult } from '../ToolInterface';

const execAsync = promisify(exec);

export class TerminalExecTool implements Tool {
  readonly name = 'terminalExec';
  readonly description = 'Execute terminal commands';
  readonly requiresPermission = true;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const command = params.command as string;
    const timeout = (params.timeout as number) || 30000;

    if (!command) {
      return { success: false, error: 'Missing required parameter: command' };
    }

    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout,
        maxBuffer: 10 * 1024 * 1024,
      });

      return {
        success: true,
        data: {
          stdout,
          stderr,
          exitCode: 0,
        },
      };
    } catch (error: unknown) {
      const err = error as Error & { code?: number; stdout?: string; stderr?: string };
      return {
        success: false,
        data: {
          stdout: err.stdout || '',
          stderr: err.stderr || err.message,
          exitCode: err.code ?? 1,
        },
        error: err.message,
      };
    }
  }
}
