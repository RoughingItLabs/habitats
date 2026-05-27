import { zoneVisualMode } from '../zoneVisualState';
import type { ZoneData } from '../../../types/zone';

function makeZone(
  partial: Partial<ZoneData> & Pick<ZoneData, 'level'>
): ZoneData {
  return {
    id: 'meadow',
    activityType: 'steps',
    state: 'established',
    lastUpdated: new Date(),
    peakLevelEver: partial.level,
    isNeglected: false,
    ...partial,
  };
}

describe('zoneVisualState', () => {
  it('classifies shimmer band', () => {
    expect(zoneVisualMode(makeZone({ level: 0.05 }))).toBe('shimmer');
  });

  it('classifies thriving at 0.9+', () => {
    expect(zoneVisualMode(makeZone({ level: 0.92 }))).toBe('thriving');
  });

  it('neglected overrides thriving appearance', () => {
    expect(
      zoneVisualMode(makeZone({ level: 0.95, isNeglected: true }))
    ).toBe('neglected');
  });
});
