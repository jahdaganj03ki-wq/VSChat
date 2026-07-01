export class TaskDecomposer {
  decompose(task: string): string[] {
    const lines = task
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length <= 1) {
      const sentences = task.split(/[.!?]+/).filter((s) => s.trim().length > 10);
      if (sentences.length > 1) {
        return sentences.map((s) => s.trim());
      }
      return [task];
    }

    return lines;
  }
}
