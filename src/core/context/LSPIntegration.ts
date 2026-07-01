import * as vscode from 'vscode';

export interface LSPInfo {
  diagnostics: vscode.Diagnostic[];
  hoverInfo?: string;
  definition?: string;
}

export class LSPIntegration {
  async getDiagnostics(uri: vscode.Uri): Promise<vscode.Diagnostic[]> {
    return vscode.languages.getDiagnostics(uri);
  }

  async getHover(uri: vscode.Uri, position: vscode.Position): Promise<string | undefined> {
    const hover = await vscode.commands.executeCommand<vscode.Hover[]>(
      'vscode.executeHoverProvider',
      uri,
      position,
    );

    if (hover && hover.length > 0) {
      return hover[0]?.contents
        .map((c) => (typeof c === 'string' ? c : (c as { value: string }).value))
        .join('\n');
    }

    return undefined;
  }

  async getDefinition(
    uri: vscode.Uri,
    position: vscode.Position,
  ): Promise<vscode.Location[] | undefined> {
    return vscode.commands.executeCommand<vscode.Location[]>(
      'vscode.executeDefinitionProvider',
      uri,
      position,
    );
  }
}
