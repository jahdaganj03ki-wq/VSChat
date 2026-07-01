interface TokenUsage {
  provider: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
  timestamp: Date;
}

export class TokenTracker {
  private usage: TokenUsage[] = [];
  private sessionTokensIn = 0;
  private sessionTokensOut = 0;

  track(provider: string, model: string, tokensIn: number, tokensOut: number): void {
    this.usage.push({ provider, model, tokensIn, tokensOut, timestamp: new Date() });
    this.sessionTokensIn += tokensIn;
    this.sessionTokensOut += tokensOut;
  }

  getSessionUsage(): { tokensIn: number; tokensOut: number; total: number } {
    return {
      tokensIn: this.sessionTokensIn,
      tokensOut: this.sessionTokensOut,
      total: this.sessionTokensIn + this.sessionTokensOut,
    };
  }

  getHistory(): TokenUsage[] {
    return [...this.usage];
  }

  reset(): void {
    this.usage = [];
    this.sessionTokensIn = 0;
    this.sessionTokensOut = 0;
  }
}
