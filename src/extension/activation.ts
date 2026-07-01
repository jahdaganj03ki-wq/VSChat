import * as vscode from 'vscode';
import { Commands } from './commands';
import { StatusBarManager } from './statusBar';
import { TreeViewProvider } from './treeView';
import { SettingsManager } from '../config/SettingsManager';
import { Database } from '../storage/Database';

let database: Database | undefined;

export function activate(context: vscode.ExtensionContext): void {
  database = Database.getInstance(context);
  database.initialize();

  const settingsManager = SettingsManager.getInstance();

  const commands = new Commands(context, settingsManager);
  commands.register();

  const statusBar = new StatusBarManager(settingsManager);
  statusBar.register(context);

  const treeViewProvider = new TreeViewProvider();
  vscode.window.registerTreeDataProvider('apex-history', treeViewProvider);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('apex-chat', {
      resolveWebviewView(webviewView) {
        webviewView.webview.options = {
          enableScripts: true,
          localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'dist')],
        };
        webviewView.webview.html = getWebviewHtml(webviewView.webview, context.extensionUri);
      },
    }),
  );

  vscode.commands.executeCommand('setContext', 'apex:activated', true);
}

export function deactivate(): void {
  if (database) {
    database.close();
  }
}

function getWebviewHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview.js'));
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview.css'));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource}; font-src ${webview.cspSource};">
  <link rel="stylesheet" href="${styleUri}">
  <title>ApexAgent</title>
</head>
<body>
  <div id="root"></div>
  <script src="${scriptUri}"></script>
</body>
</html>`;
}
