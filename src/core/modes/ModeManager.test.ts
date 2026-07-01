import { describe, it, expect } from 'vitest';
import { ModeManager } from './ModeManager';

describe('ModeManager', () => {
  it('should start with plan mode by default', () => {
    const manager = new ModeManager();
    expect(manager.getCurrent().name).toBe('plan');
  });

  it('should start with specified mode', () => {
    const manager = new ModeManager('code');
    expect(manager.getCurrent().name).toBe('code');
  });

  it('should switch modes', () => {
    const manager = new ModeManager('plan');
    expect(manager.switchTo('code')).toBe(true);
    expect(manager.getCurrent().name).toBe('code');
  });

  it('should return false for unknown modes', () => {
    const manager = new ModeManager();
    expect(manager.switchTo('unknown')).toBe(false);
  });

  it('should track mode history', () => {
    const manager = new ModeManager('plan');
    manager.switchTo('code');
    manager.switchTo('plan');
    expect(manager.getHistory()).toEqual(['plan', 'code', 'plan']);
  });

  it('should notify listeners on mode change', () => {
    const manager = new ModeManager('plan');
    let changed = false;
    const unsub = manager.onModeChange(() => {
      changed = true;
    });
    manager.switchTo('code');
    expect(changed).toBe(true);
    unsub();
  });

  it('should check read-only status', () => {
    const manager = new ModeManager('plan');
    expect(manager.isReadonly()).toBe(true);
    manager.switchTo('code');
    expect(manager.isReadonly()).toBe(false);
  });
});
