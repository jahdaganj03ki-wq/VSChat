import * as vscode from 'vscode';

export interface SelectionInfo {
  selectedText: string;
  enclosingFunction?: string;
  enclosingClass?: string;
  lineStart: number;
  lineEnd: number;
}

export class SelectionContext {
  getSelection(): SelectionInfo | undefined {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.selection.isEmpty) return undefined;

    const selection = editor.selection;
    const document = editor.document;
    const selectedText = document.getText(selection);

    return {
      selectedText,
      lineStart: selection.start.line + 1,
      lineEnd: selection.end.line + 1,
    };
  }
}
