import React from 'react';
import { useChatStore } from './hooks/useChatStore';
import { ChatPanel } from './components/ChatPanel';

export function App() {
  const mode = useChatStore((s) => s.mode);
  const loadHistory = useChatStore((s) => s.loadHistory);

  React.useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div
      style={{
        borderTop: `3px solid ${mode === 'plan' ? '#3b82f6' : '#22c55e'}`,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <main style={{ flex: 1, overflow: 'hidden' }}>
        <ChatPanel />
      </main>
    </div>
  );
}
