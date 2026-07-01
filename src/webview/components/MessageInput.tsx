import React from 'react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps): React.ReactElement {
  const [input, setInput] = React.useState('');
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, [disabled]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      style={{
        padding: '8px 12px',
        borderTop: '1px solid var(--vscode-panel-border)',
        display: 'flex',
        gap: 8,
        alignItems: 'flex-end',
      }}
    >
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message... (Shift+Enter for new line)"
        rows={2}
        disabled={disabled}
        style={{
          flex: 1,
          resize: 'none',
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid var(--vscode-input-border)',
          background: 'var(--vscode-input-background)',
          color: 'var(--vscode-input-foreground)',
          fontFamily: 'var(--vscode-font-family)',
          fontSize: 13,
          lineHeight: 1.4,
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !input.trim()}
        style={{
          padding: '8px 16px',
          borderRadius: 6,
          border: 'none',
          background: disabled
            ? 'var(--vscode-button-secondaryBackground)'
            : 'var(--vscode-button-background)',
          color: 'var(--vscode-button-foreground)',
          cursor: disabled ? 'default' : 'pointer',
          fontWeight: 600,
          fontSize: 13,
          whiteSpace: 'nowrap',
        }}
      >
        {disabled ? '...' : 'Send'}
      </button>
    </div>
  );
}
