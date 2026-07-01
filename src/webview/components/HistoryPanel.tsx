import React from 'react';

interface HistoryEntry {
  id: string;
  title: string;
  date: Date;
  messageCount: number;
}

export function HistoryPanel(): React.ReactElement {
  const [entries] = React.useState<HistoryEntry[]>([]);
  const [search, setSearch] = React.useState('');

  const filtered = entries.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: '8px 12px', overflowY: 'auto', height: '100%' }}>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search conversations..."
        style={{
          width: '100%',
          padding: '6px 8px',
          marginBottom: 12,
          borderRadius: 4,
          border: '1px solid var(--vscode-input-border)',
          background: 'var(--vscode-input-background)',
          color: 'var(--vscode-input-foreground)',
          fontSize: 12,
          boxSizing: 'border-box',
        }}
      />
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            color: 'var(--vscode-descriptionForeground)',
            fontSize: 12,
            marginTop: 24,
          }}
        >
          {entries.length === 0
            ? 'No conversations yet. Start chatting!'
            : 'No conversations match your search.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {filtered.map((entry) => (
            <div
              key={entry.id}
              style={{
                padding: '8px 12px',
                borderRadius: 4,
                cursor: 'pointer',
                border: '1px solid transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--vscode-panel-border)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 500 }}>{entry.title}</div>
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--vscode-descriptionForeground)',
                  marginTop: 2,
                }}
              >
                {entry.date.toLocaleDateString()} - {entry.messageCount} messages
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
