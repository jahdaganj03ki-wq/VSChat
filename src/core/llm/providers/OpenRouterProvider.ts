import { OpenAIProvider } from './OpenAIProvider';

export class OpenRouterProvider extends OpenAIProvider {
  readonly name = 'openrouter' as string;

  constructor(apiKey: string) {
    super(apiKey, 'https://openrouter.ai/api/v1');
  }
}
