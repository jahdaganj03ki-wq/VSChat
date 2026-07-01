export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMStreamEvent {
  type: 'token' | 'done' | 'error';
  content?: string;
  error?: string;
}

export interface LLMCompletionOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
}

export interface LLMProvider {
  readonly name: string;
  stream(messages: LLMMessage[], options?: LLMCompletionOptions): AsyncGenerator<LLMStreamEvent>;
  complete(messages: LLMMessage[], options?: LLMCompletionOptions): Promise<string>;
  countTokens(messages: LLMMessage[]): number;
  embed?(text: string): Promise<number[]>;
}
