import { normalizeTime, weekStart, monthRange, formatHours } from './team';

describe('team utils', () => {
  it('normalizeTime', () => {
    expect(normalizeTime('9')).toBe('09:00');
    expect(normalizeTime('930')).toBe('09:30');
    expect(normalizeTime('16.30')).toBe('16:30');
    expect(normalizeTime('24')).toBe('00:00');
    expect(normalizeTime('25:00')).toBeNull();
    expect(normalizeTime('abc')).toBeNull();
  });
  it('weekStart pazartesi döner', () => {
    expect(weekStart('2026-10-10')).toBe('2026-10-05'); // Cumartesi → Pazartesi
    expect(weekStart('2026-10-05')).toBe('2026-10-05');
    expect(weekStart('2026-10-11')).toBe('2026-10-05'); // Pazar
  });
  it('monthRange', () => {
    expect(monthRange(2026, 1)).toEqual({ from: '2026-02-01', to: '2026-02-28' });
  });
  it('formatHours', () => {
    expect(formatHours(540)).toBe('9 sa');
    expect(formatHours(510)).toBe('8,5 sa');
  });
});
