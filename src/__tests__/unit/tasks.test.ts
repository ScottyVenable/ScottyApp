import {getLevelFromXP, getXPForNextLevel, PRIORITY_XP, LEVEL_THRESHOLDS} from '../../types/tasks';

describe('XP & Level System', () => {
  test('level 1 at 0 XP', () => {
    expect(getLevelFromXP(0)).toBe(1);
  });

  test('level 2 at 100 XP', () => {
    expect(getLevelFromXP(100)).toBe(2);
  });

  test('level 10 at 5800 XP', () => {
    expect(getLevelFromXP(5800)).toBe(10);
  });

  test('getXPForNextLevel returns correct progress', () => {
    const result = getXPForNextLevel(0);
    expect(result.progress).toBe(0);
    expect(result.next).toBe(100);
  });

  test('getXPForNextLevel at halfway point', () => {
    const result = getXPForNextLevel(50);
    expect(result.progress).toBeCloseTo(0.5);
  });

  test('priority XP values are correct', () => {
    expect(PRIORITY_XP.urgent).toBe(50);
    expect(PRIORITY_XP.high).toBe(30);
    expect(PRIORITY_XP.medium).toBe(15);
    expect(PRIORITY_XP.low).toBe(5);
  });

  test('level thresholds are ascending', () => {
    for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
      expect(LEVEL_THRESHOLDS[i]).toBeGreaterThan(LEVEL_THRESHOLDS[i - 1] ?? 0);
    }
  });
});
