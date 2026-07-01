import React from 'react';

interface SubAgent {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  task: string;
  progress: number;
}

export function SubAgentView(): React.ReactElement {
  const [agents] = React.useState<SubAgent[]>([]);

  const statusColors: Record<string, string> = {
    running: '#22c55e',
    completed: '#3b82f6',
    failed: '#ef4444',
    pending: '#6b7280',
  };

  return (
    <div style={{ padding: '8px 12px', overflowY: 'auto', height: '100%' }}>
      <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Sub-Agents</h2>
      {agents.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            color: 'var(--vscode-descriptionForeground)',
            fontSize: 12,
            marginTop: 24,
          }}
        >
          No active sub-agents. Complex tasks will be automatically decomposed here.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {agents.map((agent) => (
            <div
              key={agent.id}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid var(--vscode-panel-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 500 }}>{agent.name}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: statusColors[agent.status],
                    textTransform: 'uppercase',
                  }}
                >
                  {agent.status}
                </span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--vscode-descriptionForeground)',
                  marginBottom: 6,
                }}
              >
                {agent.task}
              </div>
              {agent.status === 'running' && (
                <div
                  style={{
                    height: 4,
                    borderRadius: 2,
                    background: 'var(--vscode-progressBar-background)',
                    width: `${agent.progress}%`,
                    transition: 'width 0.3s ease',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
