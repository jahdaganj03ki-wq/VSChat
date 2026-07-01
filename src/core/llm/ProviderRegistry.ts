import type { LLMProvider } from './LLMInterface';

export class ProviderRegistry {
  private providers = new Map<string, LLMProvider>();
  private activeProvider: string | null = null;

  register(name: string, provider: LLMProvider): void {
    this.providers.set(name, provider);
  }

  get(name: string): LLMProvider | undefined {
    return this.providers.get(name);
  }

  setActive(name: string): void {
    if (!this.providers.has(name)) {
      throw new Error(`Provider "${name}" is not registered`);
    }
    this.activeProvider = name;
  }

  getActive(): LLMProvider | undefined {
    if (!this.activeProvider) return undefined;
    return this.providers.get(this.activeProvider);
  }

  getAll(): string[] {
    return Array.from(this.providers.keys());
  }

  unregister(name: string): void {
    this.providers.delete(name);
    if (this.activeProvider === name) {
      this.activeProvider = null;
    }
  }
}
