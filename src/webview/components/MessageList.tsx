import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  onRegenerate: (messageId: string) => void;
  onFeedback: (messageId: string, feedback: 'thumbs_up' | 'thumbs_down') => void;
}

export function MessageList({
  messages,
  onRegenerate,
  onFeedback,
}: MessageListProps): React.ReactElement {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {messages.map((message) => (
        <div
          key={message.id}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            background:
              message.role === 'user' ? 'var(--vscode-textBlockQuote-background)' : 'transparent',
            border: message.role === 'system' ? '1px dashed var(--vscode-panel-border)' : 'none',
            opacity: message.role === 'system' ? 0.7 : 1,
          }}
        >
          {message.role === 'system' && (
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'var(--vscode-descriptionForeground)',
                marginBottom: 4,
              }}
            >
              System
            </div>
          )}
          <MarkdownRenderer content={message.content} />
          {message.role === 'assistant' && message.content.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: 8,
                marginTop: 8,
                paddingTop: 8,
                borderTop: '1px solid var(--vscode-panel-border)',
              }}
            >
              <button
                onClick={() => onFeedback(message.id, 'thumbs_up')}
                style={actionButtonStyle}
                title="Helpful"
              >
                {'\u{1F44D}'}
              </button>
              <button
                onClick={() => onFeedback(message.id, 'thumbs_down')}
                style={actionButtonStyle}
                title="Not helpful"
              >
                {'\u{1F44E}'}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(message.content);
                }}
                style={actionButtonStyle}
                title="Copy"
              >
                {'\u{1F4CB}'}
              </button>
              <button
                onClick={() => onRegenerate(message.id)}
                style={actionButtonStyle}
                title="Regenerate"
              >
                {'\u{1F504}'}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const actionButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '2px 4px',
  fontSize: 14,
  borderRadius: 3,
  opacity: 0.6,
};
