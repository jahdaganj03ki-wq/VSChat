import { HistoryStore, type HistoryEntry } from './HistoryStore';

export class HistoryExport {
  constructor(private store: HistoryStore) {}

  toJSON(entries: HistoryEntry[]): string {
    return JSON.stringify(entries, null, 2);
  }

  toMarkdown(entries: HistoryEntry[]): string {
    const header = '# ApexAgent Conversation History\n\n';
    const rows = entries
      .map(
        (entry) =>
          `## ${entry.title}\n- **Date:** ${entry.updatedAt}\n- **Mode:** ${entry.mode}\n- **Persona:** ${entry.persona}\n- **Messages:** ${entry.messageCount}\n`,
      )
      .join('\n---\n\n');

    return header + rows;
  }
}
