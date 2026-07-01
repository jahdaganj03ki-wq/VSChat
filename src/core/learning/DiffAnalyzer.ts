import { diffLines } from 'diff';

interface DiffResult {
  hasChanges: boolean;
  additions: number;
  removals: number;
  summary: string;
}

export class DiffAnalyzer {
  analyze(original: string, modified: string): DiffResult {
    const changes = diffLines(original, modified);

    let additions = 0;
    let removals = 0;

    for (const part of changes) {
      if (part.added) additions += part.count || 0;
      if (part.removed) removals += part.count || 0;
    }

    const summary =
      additions > 0 || removals > 0 ? `+${additions}/-${removals} lines changed` : 'No changes';

    return {
      hasChanges: additions > 0 || removals > 0,
      additions,
      removals,
      summary,
    };
  }
}
