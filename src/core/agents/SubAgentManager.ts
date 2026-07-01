export interface SubAgentInstance {
  id: string;
  task: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  result?: string;
  startedAt: Date;
  completedAt?: Date;
}

export class SubAgentManager {
  private agents = new Map<string, SubAgentInstance>();
  private maxConcurrent = 3;

  setMaxConcurrent(max: number): void {
    this.maxConcurrent = max;
  }

  async spawn(task: string): Promise<SubAgentInstance> {
    const agent: SubAgentInstance = {
      id: crypto.randomUUID(),
      task,
      status: 'running',
      startedAt: new Date(),
    };

    this.agents.set(agent.id, agent);

    try {
      agent.result = await this.executeTask(task);
      agent.status = 'completed';
    } catch (error) {
      agent.status = 'failed';
      agent.result = error instanceof Error ? error.message : 'Unknown error';
    }

    agent.completedAt = new Date();
    return agent;
  }

  private async executeTask(task: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return `Processed: ${task}`;
  }

  get(id: string): SubAgentInstance | undefined {
    return this.agents.get(id);
  }

  getAll(): SubAgentInstance[] {
    return Array.from(this.agents.values());
  }

  getActiveCount(): number {
    return Array.from(this.agents.values()).filter((a) => a.status === 'running').length;
  }
}
