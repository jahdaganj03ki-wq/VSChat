import { HistoryStore, type HistoryEntry } from './HistoryStore';

export class HistorySearch {
  constructor(private store: HistoryStore) {}

  search(query: string): HistoryEntry[] {
    return this.store.search(query);
  }

  searchByDateRange(from: Date, to: Date): HistoryEntry[] {
    const all = this.store.getAll(1000, 0);
    return all.filter((entry) => {
      const date = new Date(entry.createdAt);
      return date >= from && date <= to;
    });
  }

  searchByMode(mode: string): HistoryEntry[] {
    const all = this.store.getAll(1000, 0);
    return all.filter((entry) => entry.mode === mode);
  }
}
