import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ProviderSelector } from './ProviderSelector';

interface ChatPanelProps {
  mode: 'plan' | 'code';
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export function ChatPanel({ mode }: ChatPanelProps): React.ReactElement {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm ApexAgent in **${mode} mode**. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);

    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    const response =
      mode === 'plan'
        ? `**Analysis:** I'll analyze your request in Plan mode.\n\nI understand you're asking about: "${content}"\n\nLet me break this down:\n1. First, I need to understand the requirements\n2. Then, assess potential approaches\n3. Finally, recommend a solution\n\n*This is a simulated response. Real LLM integration coming in Phase 4.*`
        : `**Implementation:** Working on it in Code mode.\n\nProcessing request: "${content}"\n\n\`\`\`typescript\n// Example implementation\nfunction processRequest(input: string): string {\n  return \`Processed: \${input}\`;\n}\n\`\`\`\n\n*This is a simulated response. Real LLM integration coming in Phase 4.*`;

    let displayed = '';
    for (let i = 0; i < response.length; i++) {
      displayed += response[i];
      await new Promise((r) => setTimeout(r, 5));
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: displayed } : m)),
      );
    }

    setIsStreaming(false);
  };

  const handleRegenerate = async (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    if (messages.length >= 2) {
      const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
      if (lastUserMessage) {
        await handleSend(lastUserMessage.content);
      }
    }
  };

  const handleFeedback = (messageId: string, _feedback: 'thumbs_up' | 'thumbs_down') => {
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, content: m.content } : m)));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ProviderSelector mode={mode} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
        <MessageList
          messages={messages}
          onRegenerate={handleRegenerate}
          onFeedback={handleFeedback}
        />
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}
