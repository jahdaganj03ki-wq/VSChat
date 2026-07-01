import React from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps): React.ReactElement {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        margin: '8px 0',
        borderRadius: 6,
        overflow: 'hidden',
        border: '1px solid var(--vscode-panel-border)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 12px',
          background: 'var(--vscode-titleBar-activeBackground)',
          borderBottom: '1px solid var(--vscode-panel-border)',
        }}
      >
        <span style={{ fontSize: 11, color: 'var(--vscode-descriptionForeground)' }}>
          {language}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={handleCopy} style={codeActionButtonStyle} title="Copy code">
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={() => {
              const vscode = acquireVsCodeApi?.();
              if (vscode) {
                vscode.postMessage({ type: 'applyCode', code, language });
              }
            }}
            style={codeActionButtonStyle}
            title="Insert at cursor"
          >
            Insert
          </button>
        </div>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '8px 12px',
          background: 'var(--vscode-textCodeBlock-background)',
          overflowX: 'auto',
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

declare function acquireVsCodeApi(): { postMessage(msg: unknown): void } | undefined;

const codeActionButtonStyle: React.CSSProperties = {
  background: 'var(--vscode-button-secondaryBackground)',
  color: 'var(--vscode-button-secondaryForeground)',
  border: 'none',
  padding: '2px 8px',
  borderRadius: 3,
  cursor: 'pointer',
  fontSize: 11,
};
