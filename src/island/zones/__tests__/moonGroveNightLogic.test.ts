import {
  isMoonGroveDayRest,
  isMoonGroveNightTime,
  moonGroveShowsBioluminescence,
} from '../moonGroveNightLogic';

describe('moonGroveNightLogic', () => {
  it('treats evening and night as active moon grove hours', () => {
    expect(isMoonGroveNightTime('evening')).toBe(true);
    expect(isMoonGroveNightTime('night')).toBe(true);
    expect(isMoonGroveNightTime('morning')).toBe(false);
  });

  it('rests by day during morning and afternoon', () => {
    expect(isMoonGroveDayRest('morning')).toBe(true);
    expect(isMoonGroveDayRest('afternoon')).toBe(true);
    expect(isMoonGroveDayRest('night')).toBe(false);
  });

  it('shows bioluminescence only at night', () => {
    expect(moonGroveShowsBioluminescence('night')).toBe(true);
    expect(moonGroveShowsBioluminescence('dawn')).toBe(false);
  });
});
