import * as vscode from 'vscode';

export interface CodeContext {
  workspacePath?: string;
  activeFilePath?: string;
  activeFileContent?: string;
  selection?: string;
  workspaceFiles: string[];
  language?: string;
}

export class CodeContextProvider {
  getContext(): CodeContext {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const editor = vscode.window.activeTextEditor;

    return {
      workspacePath: workspaceFolders?.[0]?.uri.fsPath,
      activeFilePath: editor?.document.uri.fsPath,
      activeFileContent: editor?.document.getText(),
      selection: editor?.document.getText(editor.selection),
      workspaceFiles: [],
      language: editor?.document.languageId,
    };
  }
}
