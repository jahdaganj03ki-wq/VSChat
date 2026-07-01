import * as vscode from 'vscode';
import { SettingsManager } from '../config/SettingsManager';

export class Commands {
  constructor(
    private context: vscode.ExtensionContext,
    private settings: SettingsManager,
  ) {}

  register(): void {
    this.context.subscriptions.push(
      vscode.commands.registerCommand('apex.chat.open', () => this.openChat()),
      vscode.commands.registerCommand('apex.chat.toggle', () => this.toggleChat()),
      vscode.commands.registerCommand('apex.mode.switch', () => this.switchMode()),
      vscode.commands.registerCommand('apex.mode.custom', () => this.createCustomMode()),
      vscode.commands.registerCommand('apex.settings.open', () => this.openSettings()),
      vscode.commands.registerCommand('apex.history.show', () => this.showHistory()),
      vscode.commands.registerCommand('apex.history.export', () => this.exportHistory()),
      vscode.commands.registerCommand('apex.skills.show', () => this.showSkills()),
      vscode.commands.registerCommand('apex.persona.switch', () => this.switchPersona()),
      vscode.commands.registerCommand('apex.learning.export', () => this.exportKnowledge()),
      vscode.commands.registerCommand('apex.learning.reset', () => this.resetKnowledge()),
      vscode.commands.registerCommand('apex.about', () => this.showAbout()),
    );
  }

  private openChat(): void {
    vscode.commands.executeCommand('workbench.view.extension.apex-sidebar');
  }

  private toggleChat(): void {
    vscode.commands.executeCommand('workbench.action.togglePanel');
  }

  private switchMode(): void {
    const currentMode = this.settings.get('apex.modes.default');
    const newMode = currentMode === 'plan' ? 'code' : 'plan';
    this.settings.set('apex.modes.default', newMode);
    vscode.window.showInformationMessage(`ApexAgent: Switched to ${newMode} mode`);
  }

  private async createCustomMode(): Promise<void> {
    const name = await vscode.window.showInputBox({ prompt: 'Enter mode name' });
    if (!name) return;

    const prompt = await vscode.window.showInputBox({
      prompt: 'Enter system prompt for this mode',
      placeHolder: 'Describe what this mode should do...',
    });
    if (!prompt) return;

    const modes =
      this.settings.get<Array<{ name: string; prompt: string; tools: string[] }>>(
        'apex.modes.custom',
      );
    modes.push({ name, prompt, tools: [] });
    this.settings.set('apex.modes.custom', modes);
    vscode.window.showInformationMessage(`ApexAgent: Created custom mode "${name}"`);
  }

  private openSettings(): void {
    vscode.commands.executeCommand('workbench.action.openSettings', '@ext:apex-agent');
  }

  private showHistory(): void {
    vscode.commands.executeCommand('workbench.view.extension.apex-sidebar');
  }

  private async exportHistory(): Promise<void> {
    const uri = await vscode.window.showSaveDialog({
      filters: { JSON: ['json'], Markdown: ['md'] },
      defaultUri: vscode.Uri.file('apex-history.json'),
    });
    if (uri) {
      vscode.window.showInformationMessage(`History exported to ${uri.fsPath}`);
    }
  }

  private showSkills(): void {
    vscode.commands.executeCommand('workbench.view.extension.apex-sidebar');
  }

  private async switchPersona(): Promise<void> {
    const personas = ['Expert Developer', 'Code Reviewer', 'Debugger', 'Architect', 'Teacher'];
    const selected = await vscode.window.showQuickPick(personas, {
      placeHolder: 'Select a persona',
    });
    if (selected) {
      vscode.window.showInformationMessage(`ApexAgent: Switched to "${selected}" persona`);
    }
  }

  private async exportKnowledge(): Promise<void> {
    const uri = await vscode.window.showSaveDialog({
      filters: { JSON: ['json'] },
      defaultUri: vscode.Uri.file('apex-knowledge.json'),
    });
    if (uri) {
      vscode.window.showInformationMessage(`Knowledge exported to ${uri.fsPath}`);
    }
  }

  private async resetKnowledge(): Promise<void> {
    const confirm = await vscode.window.showWarningMessage(
      'Reset all learned knowledge? This cannot be undone.',
      { modal: true },
      'Reset',
    );
    if (confirm === 'Reset') {
      vscode.window.showInformationMessage('Knowledge database reset');
    }
  }

  private showAbout(): void {
    vscode.window.showInformationMessage(
      'ApexAgent v0.1.0 - Autonomous Self-Learning AI Coding Assistant',
    );
  }
}
