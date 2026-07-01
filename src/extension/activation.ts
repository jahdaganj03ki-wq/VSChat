import * as vscode from 'vscode';
import { Commands } from './commands';
import { StatusBarManager } from './statusBar';
import { TreeViewProvider } from './treeView';
import { SettingsManager } from '../config/SettingsManager';
import { Database } from '../storage/Database';
import { ProviderRegistry } from '../core/llm/ProviderRegistry';
import { ChatEngine } from '../core/chat/ChatEngine';
import { ConversationManager } from '../core/chat/ConversationManager';
import { MessageStore } from '../core/chat/MessageStore';
import { OpenAIProvider } from '../core/llm/providers/OpenAIProvider';

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

  const providerRegistry = new ProviderRegistry();
  const chatEngine = new ChatEngine();
  const conversationManager = new ConversationManager();
  const messageStore = new MessageStore();

  registerProviders(providerRegistry, settingsManager);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('apex-chat', {
      resolveWebviewView(webviewView) {
        webviewView.webview.options = {
          enableScripts: true,
          localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'dist')],
        };

        webviewView.webview.html = getWebviewHtml(webviewView.webview, context.extensionUri);

        webviewView.webview.onDidReceiveMessage(async (message) => {
          switch (message.type) {
            case 'sendMessage':
              await handleSendMessage(
                webviewView,
                message,
                chatEngine,
                providerRegistry,
                conversationManager,
                messageStore,
              );
              break;
            case 'setMode':
              settingsManager.set('apex.modes.default', message.mode);
              break;
            case 'setProvider':
              providerRegistry.setActive(message.provider);
              break;
            case 'setPersona':
              break;
            case 'loadHistory':
              handleLoadHistory(webviewView, conversationManager);
              break;
          }
        });
      },
    }),
  );

  vscode.commands.executeCommand('setContext', 'apex:activated', true);
}

function registerProviders(registry: ProviderRegistry, settings: SettingsManager): void {
  const apiKey = settings.get<string>('apex.providers.openai.apiKey') || '';
  const baseUrl =
    settings.get<string>('apex.providers.openai.baseUrl') || 'https://api.openai.com/v1';
  registry.register('openai', new OpenAIProvider(apiKey, baseUrl));
}

async function handleSendMessage(
  webviewView: vscode.WebviewView,
  message: { content: string; messageId: string; mode: string; provider: string; persona: string },
  chatEngine: ChatEngine,
  providerRegistry: ProviderRegistry,
  conversationManager: ConversationManager,
  messageStore: MessageStore,
): Promise<void> {
  const provider = providerRegistry.get(message.provider);
  if (!provider) {
    webviewView.webview.postMessage({
      type: 'streamingError',
      id: message.messageId,
      error: `Provider "${message.provider}" not found`,
    });
    return;
  }

  const activeConversation = conversationManager.getActive() || conversationManager.create();
  conversationManager.addMessage(activeConversation.id, {
    role: 'user',
    content: message.content,
  });

  chatEngine.createSession({
    id: activeConversation.id,
    messages: activeConversation.messages,
    provider,
    onToken: (token) => {
      webviewView.webview.postMessage({
        type: 'streamingToken',
        id: message.messageId,
        token,
      });
    },
    onDone: () => {
      webviewView.webview.postMessage({ type: 'streamingDone', id: message.messageId });
      const active = conversationManager.getActive();
      if (active) {
        messageStore.add(active.id, active.messages[active.messages.length - 1]);
      }
    },
    onError: (error) => {
      webviewView.webview.postMessage({
        type: 'streamingError',
        id: message.messageId,
        error,
      });
    },
  });

  chatEngine.sendMessage(activeConversation.id, message.content).catch((err) => {
    webviewView.webview.postMessage({
      type: 'streamingError',
      id: message.messageId,
      error: err instanceof Error ? err.message : String(err),
    });
  });
}

function handleLoadHistory(
  webviewView: vscode.WebviewView,
  conversationManager: ConversationManager,
): void {
  const conversations = conversationManager.getAll().map((c) => ({
    id: c.id,
    title: c.title,
    messages: c.messages,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
  webviewView.webview.postMessage({ type: 'historyLoaded', conversations });
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
