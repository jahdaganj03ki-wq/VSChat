import React from 'react';
import { useChatStore } from '../hooks/useChatStore';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ProviderSelector } from './ProviderSelector';

export function ChatPanel() {
  const messages = useChatStore((s) => s.messages);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const removeMessage = useChatStore((s) => s.removeMessage);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleRegenerate = (messageId: string) => {
    removeMessage(messageId);
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      sendMessage(lastUser.content);
    }
  };

  const handleFeedback = (_feedback: unknown) => {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ProviderSelector />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
        <MessageList
          messages={messages}
          onRegenerate={handleRegenerate}
          onFeedback={handleFeedback}
        />
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSend={sendMessage} disabled={isStreaming} />
    </div>
  );
}
