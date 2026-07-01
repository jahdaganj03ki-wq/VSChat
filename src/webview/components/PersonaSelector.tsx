import { useChatStore } from '../hooks/useChatStore';

const PERSONAS = [
  { id: 'expert-developer', label: 'Expert Developer', description: 'Clean code + best practices' },
  { id: 'code-reviewer', label: 'Code Reviewer', description: 'Strict, security-focused' },
  { id: 'debugger', label: 'Debugger', description: 'Step-by-step analysis' },
  { id: 'architect', label: 'Architect', description: 'High-level design, patterns' },
  { id: 'teacher', label: 'Teacher', description: 'Explains concepts, pedagogical' },
  { id: 'custom', label: 'Custom', description: 'Free-form system prompt' },
] as const;

export function PersonaSelector() {
  const persona = useChatStore((s) => s.persona);
  const setPersona = useChatStore((s) => s.setPersona);

  return (
    <select
      value={persona}
      onChange={(e) => setPersona(e.target.value)}
      style={{
        padding: '2px 6px',
        borderRadius: 3,
        border: '1px solid var(--vscode-dropdown-border)',
        background: 'var(--vscode-dropdown-background)',
        color: 'var(--vscode-dropdown-foreground)',
        fontSize: 12,
      }}
    >
      {PERSONAS.map((p) => (
        <option key={p.id} value={p.id}>
          {p.label}
        </option>
      ))}
    </select>
  );
}
