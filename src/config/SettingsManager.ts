import * as vscode from 'vscode';
import type { ApexConfig } from './ConfigSchema';

export class SettingsManager {
  private static instance: SettingsManager;
  private listeners = new Map<string, Array<() => void>>();

  static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }

  get<T = unknown>(key: string): T {
    return vscode.workspace.getConfiguration().get<T>(key) as T;
  }

  set(key: string, value: unknown): void {
    vscode.workspace.getConfiguration().update(key, value, vscode.ConfigurationTarget.Global);
    this.notify(key);
  }

  getAll(): ApexConfig {
    const config = vscode.workspace.getConfiguration();
    const result: Record<string, unknown> = {};
    const keys = config.keys ?? [];

    for (const key of keys) {
      if (key.startsWith('apex.')) {
        result[key] = config.get(key);
      }
    }

    return result as unknown as ApexConfig;
  }

  onDidChange(key: string, callback: () => void): vscode.Disposable {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key)!.push(callback);

    return {
      dispose: () => {
        const arr = this.listeners.get(key);
        if (arr) {
          const idx = arr.indexOf(callback);
          if (idx >= 0) arr.splice(idx, 1);
        }
      },
    };
  }

  private notify(key: string): void {
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      for (const cb of callbacks) {
        try {
          cb();
        } catch (e) {
          console.error(`SettingsManager: error in listener for ${key}:`, e);
        }
      }
    }
  }
}
