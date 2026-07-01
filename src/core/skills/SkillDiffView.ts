export interface SkillDiff {
  skillName: string;
  originalInstructions: string;
  newInstructions: string;
  changes: string[];
  approved: boolean;
}

export class SkillDiffView {
  private pendingDiffs: SkillDiff[] = [];

  addDiff(diff: SkillDiff): void {
    this.pendingDiffs.push(diff);
  }

  getPending(): SkillDiff[] {
    return [...this.pendingDiffs];
  }

  approve(skillName: string): void {
    const diff = this.pendingDiffs.find((d) => d.skillName === skillName && !d.approved);
    if (diff) {
      diff.approved = true;
    }
  }

  reject(skillName: string): void {
    this.pendingDiffs = this.pendingDiffs.filter((d) => d.skillName !== skillName);
  }
}
