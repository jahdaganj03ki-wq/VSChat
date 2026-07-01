import type { Tool, ToolResult } from '../ToolInterface';

export class WebSearchTool implements Tool {
  readonly name = 'webSearch';
  readonly description = 'Search the web using a search API';
  readonly requiresPermission = true;

  private searchUrl = 'https://api.duckduckgo.com/?q=';

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const query = params.query as string;
    if (!query) {
      return { success: false, error: 'Missing required parameter: query' };
    }

    try {
      const response = await fetch(`${this.searchUrl}${encodeURIComponent(query)}&format=json`);
      const data = await response.json();
      return { success: true, data: { results: data, query } };
    } catch (error) {
      return {
        success: false,
        error: `Web search failed: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}
