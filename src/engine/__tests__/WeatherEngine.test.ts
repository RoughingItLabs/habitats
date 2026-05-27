import {
  anyZoneNeglected,
  anyZoneThriving,
  determineWeather,
  isMoonGroveThriving,
  isZoneThriving,
} from '../WeatherEngine';
import type { ZoneData } from '../../types/zone';

function zone(level: number, isNeglected = false): ZoneData {
  return {
    id: 'meadow',
    activityType: 'steps',
    level,
    state: 'established',
    lastUpdated: new Date(),
    peakLevelEver: level,
    isNeglected,
  };
}

function moonGrove(level: number): ZoneData {
  return { ...zone(level), id: 'moongrove', activityType: 'sleep' };
}

describe('WeatherEngine', () => {
  it('detects thriving zones at 0.9+', () => {
    expect(isZoneThriving(zone(0.89))).toBe(false);
    expect(isZoneThriving(zone(0.9))).toBe(true);
  });

  it('returns morning_mist at dawn', () => {
    expect(
      determineWeather({
        timeOfDay: 'dawn',
        zones: {},
        sleepActivityLevel: 0,
      })
    ).toBe('morning_mist');
  });

  it('returns soft_rain when any zone is neglected', () => {
    expect(
      determineWeather({
        timeOfDay: 'morning',
        zones: { meadow: zone(0.5, true) },
        sleepActivityLevel: 0,
      })
    ).toBe('soft_rain');
  });

  it('returns golden_light in afternoon with thriving zone', () => {
    expect(
      determineWeather({
        timeOfDay: 'afternoon',
        zones: { meadow: zone(0.92) },
        sleepActivityLevel: 0,
      })
    ).toBe('golden_light');
  });

  it('returns aurora at night with thriving moon grove and high sleep', () => {
    const zones = { moongrove: moonGrove(0.95) };
    expect(isMoonGroveThriving(zones)).toBe(true);
    expect(
      determineWeather({
        timeOfDay: 'night',
        zones,
        sleepActivityLevel: 0.9,
      })
    ).toBe('aurora');
  });

  it('returns clear by default', () => {
    expect(
      determineWeather({
        timeOfDay: 'morning',
        zones: { meadow: zone(0.5) },
        sleepActivityLevel: 0.5,
      })
    ).toBe('clear');
    expect(anyZoneThriving({ meadow: zone(0.5) })).toBe(false);
    expect(anyZoneNeglected({ meadow: zone(0.5) })).toBe(false);
  });
});
