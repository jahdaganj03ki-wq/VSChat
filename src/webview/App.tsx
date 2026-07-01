import React from 'react';
import { useChatStore, type View } from './hooks/useChatStore';
import { ChatPanel } from './components/ChatPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { SubAgentView } from './components/SubAgentView';

export function App() {
  const mode = useChatStore((s) => s.mode);
  const currentView = useChatStore((s) => s.currentView);
  const setCurrentView = useChatStore((s) => s.setCurrentView);
  const loadHistory = useChatStore((s) => s.loadHistory);

  React.useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const viewStyle: React.CSSProperties = {
    borderTop: `3px solid ${mode === 'plan' ? '#3b82f6' : '#22c55e'}`,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={viewStyle}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderBottom: '1px solid var(--vscode-panel-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontWeight: 600,
              fontSize: 13,
              color: mode === 'plan' ? '#3b82f6' : '#22c55e',
            }}
          >
            {mode === 'plan' ? '\u{1F9E0} PLAN' : '\u26A1 CODE'}
          </span>
          <span style={{ fontSize: 11, color: 'var(--vscode-descriptionForeground)' }}>
            ApexAgent
          </span>
        </div>
        <nav style={{ display: 'flex', gap: 4 }}>
          {(['chat', 'history', 'subagents', 'settings'] as View[]).map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              style={{
                background:
                  currentView === view ? 'var(--vscode-button-background)' : 'transparent',
                color:
                  currentView === view
                    ? 'var(--vscode-button-foreground)'
                    : 'var(--vscode-foreground)',
                border: 'none',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: 12,
                borderRadius: 3,
              }}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </nav>
      </header>
      <main style={{ flex: 1, overflow: 'hidden' }}>
        {currentView === 'chat' && <ChatPanel />}
        {currentView === 'settings' && <SettingsPanel />}
        {currentView === 'history' && <HistoryPanel />}
        {currentView === 'subagents' && <SubAgentView />}
      </main>
    </div>
  );
}
