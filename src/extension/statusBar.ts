import * as vscode from 'vscode';
import { SettingsManager } from '../config/SettingsManager';

export class StatusBarManager {
  private statusBarItem: vscode.StatusBarItem;

  constructor(private settings: SettingsManager) {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBarItem.command = 'apex.mode.switch';
    this.updateStatusBar();
  }

  register(context: vscode.ExtensionContext): void {
    context.subscriptions.push(this.statusBarItem);
    this.statusBarItem.show();

    context.subscriptions.push(
      this.settings.onDidChange('apex.modes.default', () => this.updateStatusBar()),
    );
  }

  private updateStatusBar(): void {
    const mode = this.settings.get<string>('apex.modes.default');
    if (mode === 'plan') {
      this.statusBarItem.text = '$(lightbulb) Apex: Plan';
      this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
      this.statusBarItem.tooltip = 'Plan Mode (Read-Only) - Click to switch to Code';
    } else {
      this.statusBarItem.text = '$(zap) Apex: Code';
      this.statusBarItem.backgroundColor = new vscode.ThemeColor(
        'statusBarItem.prominentForeground',
      );
      this.statusBarItem.tooltip = 'Code Mode (Full Access) - Click to switch to Plan';
    }
  }
}
