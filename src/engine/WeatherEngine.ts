import type { TimeOfDay } from './TimeEngine';
import type { ZoneData, ZoneId } from '../types/zone';

export type WeatherType =
  | 'clear'
  | 'golden_light'
  | 'soft_rain'
  | 'morning_mist'
  | 'aurora';

export interface WeatherInput {
  timeOfDay: TimeOfDay;
  zones: Partial<Record<ZoneId, ZoneData>>;
  sleepActivityLevel: number;
}

export function isZoneThriving(zone: ZoneData): boolean {
  return zone.level >= 0.9;
}

export function anyZoneThriving(
  zones: Partial<Record<ZoneId, ZoneData>>
): boolean {
  return Object.values(zones).some(
    zone => zone != null && isZoneThriving(zone)
  );
}

export function anyZoneNeglected(
  zones: Partial<Record<ZoneId, ZoneData>>
): boolean {
  return Object.values(zones).some(zone => zone != null && zone.isNeglected);
}

export function isMoonGroveThriving(
  zones: Partial<Record<ZoneId, ZoneData>>
): boolean {
  const grove = zones.moongrove;
  return grove != null && isZoneThriving(grove);
}

/**
 * Island health–driven weather (not random). Priority: aurora → golden → rain → mist → clear.
 */
export function determineWeather(input: WeatherInput): WeatherType {
  const { timeOfDay, zones, sleepActivityLevel } = input;
  const isNight = timeOfDay === 'night' || timeOfDay === 'evening';

  if (
    isNight &&
    isMoonGroveThriving(zones) &&
    sleepActivityLevel > 0.85
  ) {
    return 'aurora';
  }

  if (timeOfDay === 'afternoon' && anyZoneThriving(zones)) {
    return 'golden_light';
  }

  if (anyZoneNeglected(zones)) {
    return 'soft_rain';
  }

  if (timeOfDay === 'dawn') {
    return 'morning_mist';
  }

  return 'clear';
}

export function sleepActivityLevelFromZones(
  zones: Partial<Record<ZoneId, ZoneData>>
): number {
  return zones.moongrove?.level ?? 0;
}
