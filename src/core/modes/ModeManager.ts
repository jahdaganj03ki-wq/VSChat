import type { ModeDefinition } from './ModeDefinitions';
import { getBuiltinMode } from './ModeDefinitions';

type ModeListener = (mode: ModeDefinition) => void;

export class ModeManager {
  private current: ModeDefinition;
  private listeners = new Set<ModeListener>();
  private history: string[] = [];

  constructor(initialMode = 'plan') {
    const mode = getBuiltinMode(initialMode) || getBuiltinMode('plan')!;
    this.current = mode;
    this.history.push(mode.name);
  }

  getCurrent(): ModeDefinition {
    return this.current;
  }

  switchTo(name: string): boolean {
    const mode = getBuiltinMode(name);
    if (!mode) return false;

    if (this.current.name === name) return true;

    this.current = mode;
    this.history.push(name);
    for (const listener of this.listeners) {
      listener(mode);
    }
    return true;
  }

  onModeChange(listener: ModeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getHistory(): string[] {
    return [...this.history];
  }

  isReadonly(): boolean {
    return this.current.readonly;
  }

  hasTool(toolName: string): boolean {
    return this.current.allowedTools.includes(toolName);
  }
}
