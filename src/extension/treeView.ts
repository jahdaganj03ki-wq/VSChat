import * as vscode from 'vscode';

export class TreeViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(_element?: vscode.TreeItem): vscode.TreeItem[] {
    return [new vscode.TreeItem('No conversations yet', vscode.TreeItemCollapsibleState.None)];
  }
}
