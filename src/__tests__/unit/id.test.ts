import {generateId} from '../../utils/id';

describe('generateId', () => {
  test('returns a non-empty string', () => {
    expect(typeof generateId()).toBe('string');
    expect(generateId().length).toBeGreaterThan(0);
  });

  test('generates unique IDs', () => {
    const ids = new Set(Array.from({length: 1000}, () => generateId()));
    expect(ids.size).toBe(1000);
  });

  test('ID contains expected separator', () => {
    const id = generateId();
    expect(id).toContain('-');
  });
});
