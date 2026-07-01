import * as vscode from 'vscode';
import * as path from 'path';

interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileTreeNode[];
}

export class FileTreeBuilder {
  async buildTree(rootPath: string, depth = 3): Promise<FileTreeNode[]> {
    const result: FileTreeNode[] = [];

    try {
      const entries = await vscode.workspace.fs.readDirectory(vscode.Uri.file(rootPath));

      for (const [name, type] of entries) {
        if (name.startsWith('.') || name === 'node_modules') continue;

        const fullPath = path.join(rootPath, name);

        if (type === vscode.FileType.Directory && depth > 0) {
          const children = await this.buildTree(fullPath, depth - 1);
          result.push({
            name,
            path: fullPath,
            type: 'directory',
            children,
          });
        } else if (type === vscode.FileType.File) {
          result.push({
            name,
            path: fullPath,
            type: 'file',
          });
        }
      }
    } catch {
      // ignore read errors
    }

    return result;
  }
}
