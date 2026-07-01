import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SubAgent {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  task: string;
  progress: number;
}

export type View = 'chat' | 'settings' | 'history' | 'subagents';

interface VSCodeAPI {
  postMessage(msg: unknown): void;
  getState(): unknown;
  setState(state: unknown): void;
}

declare function acquireVsCodeApi(): VSCodeAPI;

const vscode =
  typeof acquireVsCodeApi !== 'undefined' ? acquireVsCodeApi() : null;

interface ChatState {
  messages: Message[];
  mode: 'plan' | 'code';
  currentView: View;
  selectedProvider: string;
  isStreaming: boolean;
  conversations: Conversation[];
  subAgents: SubAgent[];
  persona: string;

  setMode: (mode: 'plan' | 'code') => void;
  setCurrentView: (view: View) => void;
  setSelectedProvider: (provider: string) => void;
  setPersona: (persona: string) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, content: string) => void;
  appendToMessage: (id: string, chunk: string) => void;
  setIsStreaming: (streaming: boolean) => void;
  sendMessage: (content: string) => void;
  clearMessages: () => void;
  setConversations: (conversations: Conversation[]) => void;
  setSubAgents: (agents: SubAgent[]) => void;
  loadHistory: () => void;
  removeMessage: (id: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm ApexAgent. How can I help you today?",
      timestamp: new Date(),
    },
  ],
  mode: 'plan',
  currentView: 'chat',
  selectedProvider: 'openai',
  isStreaming: false,
  conversations: [],
  subAgents: [],
  persona: 'expert-developer',

  setMode: (mode) => {
    set({ mode });
    vscode?.postMessage({ type: 'setMode', mode });
  },

  setCurrentView: (currentView) => set({ currentView }),

  setSelectedProvider: (provider) => {
    set({ selectedProvider: provider });
    vscode?.postMessage({ type: 'setProvider', provider });
  },

  setPersona: (persona) => {
    set({ persona });
    vscode?.postMessage({ type: 'setPersona', persona });
  },

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateMessage: (id, content) =>
    set((state) => ({
      messages: state.messages.map((m) => (m.id === id ? { ...m, content } : m)),
    })),

  appendToMessage: (id, chunk) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content: m.content + chunk } : m,
      ),
    })),

  setIsStreaming: (isStreaming) => set({ isStreaming }),

  sendMessage: (content) => {
    const state = get();
    const timestamp = Date.now();

    const userMessage: Message = {
      id: `user-${timestamp}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const assistantId = `assistant-${timestamp + 1}`;
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    set((prev) => ({
      messages: [...prev.messages, userMessage, assistantMessage],
      isStreaming: true,
    }));

    vscode?.postMessage({
      type: 'sendMessage',
      content,
      messageId: assistantId,
      mode: state.mode,
      provider: state.selectedProvider,
      persona: state.persona,
    });
  },

  clearMessages: () => set({ messages: [], isStreaming: false }),

  setConversations: (conversations) => set({ conversations }),

  setSubAgents: (agents) => set({ subAgents: agents }),

  loadHistory: () => {
    vscode?.postMessage({ type: 'loadHistory' });
  },

  removeMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id),
    })),
}));

if (typeof window !== 'undefined') {
  window.addEventListener('message', (event: MessageEvent) => {
    const message = event.data;

    switch (message.type) {
      case 'modeChanged':
        useChatStore.setState({ mode: message.mode });
        break;
      case 'historyLoaded':
        useChatStore.getState().setConversations(message.conversations || []);
        break;
      case 'newMessage':
        useChatStore.getState().addMessage(message.message);
        break;
      case 'updateMessage':
        useChatStore.getState().updateMessage(message.id, message.content);
        break;
      case 'streamingToken':
        useChatStore.getState().appendToMessage(message.id, message.token);
        break;
      case 'streamingStart':
        useChatStore.setState({ isStreaming: true });
        break;
      case 'streamingDone':
        useChatStore.setState({ isStreaming: false });
        break;
      case 'streamingError':
        useChatStore.setState({ isStreaming: false });
        break;
      case 'subAgentsUpdated':
        useChatStore.getState().setSubAgents(message.agents || []);
        break;
      case 'providerChanged':
        useChatStore.getState().setSelectedProvider(message.provider);
        break;
    }
  });
}
