import React from 'react';

interface ProviderSelectorProps {
  mode: 'plan' | 'code';
}

const PROVIDERS = [
  { id: 'openai', label: 'OpenAI' },
  { id: 'anthropic', label: 'Anthropic' },
  { id: 'ollama', label: 'Ollama' },
  { id: 'azure-openai', label: 'Azure OpenAI' },
  { id: 'google-gemini', label: 'Google Gemini' },
  { id: 'github-copilot', label: 'GitHub Copilot' },
  { id: 'openrouter', label: 'OpenRouter' },
  { id: 'nvidia-nim', label: 'NVIDIA NIM' },
  { id: 'opencode-zen', label: 'OpenCode Zen' },
  { id: 'puter-ai', label: 'Puter AI' },
] as const;

export function ProviderSelector({ mode }: ProviderSelectorProps): React.ReactElement {
  const [selected, setSelected] = React.useState('openai');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 12px',
        borderBottom: '1px solid var(--vscode-panel-border)',
        fontSize: 12,
      }}
    >
      <span style={{ color: 'var(--vscode-descriptionForeground)', whiteSpace: 'nowrap' }}>
        Provider:
      </span>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{
          flex: 1,
          padding: '2px 6px',
          borderRadius: 3,
          border: '1px solid var(--vscode-dropdown-border)',
          background: 'var(--vscode-dropdown-background)',
          color: 'var(--vscode-dropdown-foreground)',
          fontSize: 12,
        }}
      >
        {PROVIDERS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
      <span
        style={{
          padding: '2px 6px',
          borderRadius: 3,
          fontSize: 10,
          fontWeight: 600,
          background: mode === 'plan' ? '#3b82f620' : '#22c55e20',
          color: mode === 'plan' ? '#3b82f6' : '#22c55e',
        }}
      >
        {mode.toUpperCase()}
      </span>
    </div>
  );
}
