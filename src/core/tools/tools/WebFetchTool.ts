import type { Tool, ToolResult } from '../ToolInterface';

export class WebFetchTool implements Tool {
  readonly name = 'webFetch';
  readonly description = 'Fetch content from URLs';
  readonly requiresPermission = true;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const url = params.url as string;
    if (!url) {
      return { success: false, error: 'Missing required parameter: url' };
    }

    try {
      const response = await fetch(url);
      const content = await response.text();
      return {
        success: true,
        data: {
          content,
          contentType: response.headers.get('content-type') || 'unknown',
          status: response.status,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Web fetch failed: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}
