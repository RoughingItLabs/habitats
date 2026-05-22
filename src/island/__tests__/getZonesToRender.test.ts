import type { ZoneData } from '../../types/zone';
import { getZonesToRender } from '../getZonesToRender';

function makeZone(
  id: ZoneData['id'],
  overrides: Partial<ZoneData> = {}
): ZoneData {
  return {
    id,
    activityType: 'steps',
    level: 0.5,
    state: 'growing',
    lastUpdated: new Date('2024-11-15'),
    peakLevelEver: 0.5,
    isNeglected: false,
    ...overrides,
  };
}

describe('getZonesToRender', () => {
  it('returns empty array when no zones are provided', () => {
    expect(getZonesToRender({})).toEqual([]);
  });

  it('returns only defined zones', () => {
    const meadow = makeZone('meadow');
    const result = getZonesToRender({ meadow, moongrove: undefined });
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(meadow);
  });

  it('returns zones in stable definition order regardless of input order', () => {
    const stonepeak = makeZone('stonepeak');
    const meadow = makeZone('meadow');
    const moongrove = makeZone('moongrove');
    const result = getZonesToRender({
      stonepeak,
      meadow,
      moongrove,
    });
    expect(result.map(z => z.id)).toEqual(['moongrove', 'meadow', 'stonepeak']);
  });

  it('preserves zone data fields', () => {
    const meadow = makeZone('meadow', { level: 0.82, isNeglected: true });
    const [zone] = getZonesToRender({ meadow });
    expect(zone?.level).toBe(0.82);
    expect(zone?.isNeglected).toBe(true);
  });
});
