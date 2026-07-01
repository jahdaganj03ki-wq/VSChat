import * as vscode from 'vscode';

export interface GitContext {
  branch: string;
  hasChanges: boolean;
  changedFiles: string[];
  recentCommits: string[];
}

export class GitContextProvider {
  async getContext(): Promise<GitContext> {
    try {
      const gitExtension = vscode.extensions.getExtension('vscode.git');
      if (!gitExtension) {
        return { branch: 'unknown', hasChanges: false, changedFiles: [], recentCommits: [] };
      }

      const git = gitExtension.exports.getAPI(1);
      const repo = git.repositories[0];

      if (!repo) {
        return { branch: 'no-repo', hasChanges: false, changedFiles: [], recentCommits: [] };
      }

      const branch = repo.state.HEAD?.name || repo.state.HEAD?.commit?.slice(0, 7) || 'detached';
      const changes = repo.state.workingTreeChanges;
      const commits = (Array.isArray(repo.state.refs) ? repo.state.refs : [])
        .filter((r: { type: number }) => r.type === 1)
        .slice(0, 5)
        .map((r: { name?: string }) => r.name || '');

      return {
        branch,
        hasChanges: changes.length > 0,
        changedFiles: changes.map((c: { uri: { fsPath: string } }) => c.uri.fsPath) as string[],
        recentCommits: commits,
      };
    } catch {
      return { branch: 'error', hasChanges: false, changedFiles: [], recentCommits: [] };
    }
  }
}
