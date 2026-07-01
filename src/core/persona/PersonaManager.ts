import { DEFAULT_PERSONAS } from './presets/defaultPersonas';

export interface Persona {
  name: string;
  label: string;
  description: string;
  systemPrompt: string;
}

export class PersonaManager {
  private personas: Map<string, Persona>;
  private activePersona: string;

  constructor() {
    this.personas = new Map();
    for (const persona of DEFAULT_PERSONAS) {
      this.personas.set(persona.name, persona);
    }
    this.activePersona = 'expert-developer';
  }

  getActive(): Persona {
    return this.personas.get(this.activePersona) || DEFAULT_PERSONAS[0];
  }

  setActive(name: string): boolean {
    if (this.personas.has(name)) {
      this.activePersona = name;
      return true;
    }
    return false;
  }

  get(name: string): Persona | undefined {
    return this.personas.get(name);
  }

  getAll(): Persona[] {
    return Array.from(this.personas.values());
  }

  add(persona: Persona): void {
    this.personas.set(persona.name, persona);
  }

  remove(name: string): void {
    this.personas.delete(name);
    if (this.activePersona === name) {
      this.activePersona = 'expert-developer';
    }
  }
}
