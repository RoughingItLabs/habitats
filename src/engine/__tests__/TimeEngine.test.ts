import {
  getTimeOfDay,
  getTimeProgress,
  readDeviceTime,
} from '../TimeEngine';

describe('TimeEngine', () => {
  describe('getTimeOfDay', () => {
    it('returns dawn from 5–7', () => {
      expect(getTimeOfDay(5)).toBe('dawn');
      expect(getTimeOfDay(7)).toBe('dawn');
    });

    it('returns morning from 8–15', () => {
      expect(getTimeOfDay(8)).toBe('morning');
      expect(getTimeOfDay(15)).toBe('morning');
    });

    it('returns afternoon from 16–18', () => {
      expect(getTimeOfDay(16)).toBe('afternoon');
      expect(getTimeOfDay(18)).toBe('afternoon');
    });

    it('returns evening from 19–20', () => {
      expect(getTimeOfDay(19)).toBe('evening');
      expect(getTimeOfDay(20)).toBe('evening');
    });

    it('returns night otherwise', () => {
      expect(getTimeOfDay(0)).toBe('night');
      expect(getTimeOfDay(4)).toBe('night');
      expect(getTimeOfDay(21)).toBe('night');
      expect(getTimeOfDay(23)).toBe('night');
    });
  });

  describe('getTimeProgress', () => {
    it('returns 0 at midnight', () => {
      expect(getTimeProgress(0, 0)).toBe(0);
    });

    it('returns 0.5 at noon', () => {
      expect(getTimeProgress(12, 0)).toBe(0.5);
    });

    it('interpolates minutes within the day', () => {
      expect(getTimeProgress(6, 0)).toBeCloseTo(0.25);
    });
  });

  describe('readDeviceTime', () => {
    it('returns valid time fields', () => {
      const result = readDeviceTime();
      expect(['dawn', 'morning', 'afternoon', 'evening', 'night']).toContain(
        result.timeOfDay
      );
      expect(result.timeProgress).toBeGreaterThanOrEqual(0);
      expect(result.timeProgress).toBeLessThan(1);
    });
  });
});
