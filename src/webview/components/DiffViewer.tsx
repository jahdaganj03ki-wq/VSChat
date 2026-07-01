import React from 'react';
import { diffChars, diffLines } from 'diff';

interface DiffViewerProps {
  original: string;
  modified: string;
  mode?: 'chars' | 'lines';
  language?: string;
}

export function DiffViewer({
  original,
  modified,
  mode = 'lines',
}: DiffViewerProps): React.ReactElement {
  const diffs = mode === 'chars' ? diffChars(original, modified) : diffLines(original, modified);

  return (
    <div
      style={{
        margin: '8px 0',
        borderRadius: 6,
        overflow: 'hidden',
        border: '1px solid var(--vscode-panel-border)',
        fontFamily: 'var(--vscode-editor-font-family, monospace)',
        fontSize: 12,
        lineHeight: 1.5,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 1,
          padding: '4px 12px',
          background: 'var(--vscode-titleBar-activeBackground)',
          borderBottom: '1px solid var(--vscode-panel-border)',
          fontSize: 11,
        }}
      >
        <span style={{ color: '#22c55e' }}>+ Added</span>
        <span style={{ color: '#ef4444' }}>- Removed</span>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '8px 12px',
          background: 'var(--vscode-textCodeBlock-background)',
        }}
      >
        {diffs.map((part, i) => {
          if (part.added) {
            return (
              <span key={i} style={{ background: '#22c55e22', color: '#22c55e' }}>
                {part.value}
              </span>
            );
          }
          if (part.removed) {
            return (
              <span key={i} style={{ background: '#ef444422', color: '#ef444e' }}>
                {part.value}
              </span>
            );
          }
          return <span key={i}>{part.value}</span>;
        })}
      </pre>
    </div>
  );
}
