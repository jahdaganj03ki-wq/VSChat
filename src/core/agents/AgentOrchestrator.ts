import { SubAgentManager } from './SubAgentManager';
import { TaskDecomposer } from './TaskDecomposer';
import { AgentMessageBus } from './AgentMessageBus';

export interface OrchestrationTask {
  id: string;
  description: string;
  subTasks: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export class AgentOrchestrator {
  private subAgentManager: SubAgentManager;
  private taskDecomposer: TaskDecomposer;
  private messageBus: AgentMessageBus;

  constructor() {
    this.subAgentManager = new SubAgentManager();
    this.taskDecomposer = new TaskDecomposer();
    this.messageBus = new AgentMessageBus();
  }

  async orchestrate(task: string): Promise<OrchestrationTask> {
    const subTasks = this.taskDecomposer.decompose(task);

    const orchestrationTask: OrchestrationTask = {
      id: crypto.randomUUID(),
      description: task,
      subTasks,
      status: 'in_progress',
    };

    const results = await Promise.all(
      subTasks.map((subTask) => this.subAgentManager.spawn(subTask)),
    );

    for (const result of results) {
      this.messageBus.publish('task_completed', {
        taskId: orchestrationTask.id,
        result,
      });
    }

    orchestrationTask.status = 'completed';
    return orchestrationTask;
  }

  getSubAgentManager(): SubAgentManager {
    return this.subAgentManager;
  }

  getMessageBus(): AgentMessageBus {
    return this.messageBus;
  }
}
