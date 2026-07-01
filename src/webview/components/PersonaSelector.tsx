import React from 'react';

interface PersonaSelectorProps {
  onSelect: (persona: string) => void;
}

const PERSONAS = [
  { id: 'expert-developer', label: 'Expert Developer', description: 'Clean code + best practices' },
  { id: 'code-reviewer', label: 'Code Reviewer', description: 'Strict, security-focused' },
  { id: 'debugger', label: 'Debugger', description: 'Step-by-step analysis' },
  { id: 'architect', label: 'Architect', description: 'High-level design, patterns' },
  { id: 'teacher', label: 'Teacher', description: 'Explains concepts, pedagogical' },
  { id: 'custom', label: 'Custom', description: 'Free-form system prompt' },
] as const;

export function PersonaSelector({ onSelect }: PersonaSelectorProps): React.ReactElement {
  const [selected, setSelected] = React.useState('expert-developer');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelected(value);
    onSelect(value);
  };

  return (
    <select
      value={selected}
      onChange={handleChange}
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
