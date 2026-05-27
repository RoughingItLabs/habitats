import type { ZoneData } from '../../types/zone';

export const ZONE_THRIVING_LEVEL = 0.9;
export const ZONE_SHIMMER_MIN = 0.03;
export const ZONE_SHIMMER_MAX = 0.12;

export type ZoneVisualMode = 'absent' | 'shimmer' | 'normal' | 'thriving' | 'neglected';

export function zoneVisualMode(zone: ZoneData): ZoneVisualMode {
  if (!zone) return 'absent';
  if (zone.isNeglected && zone.level >= ZONE_SHIMMER_MIN) {
    return 'neglected';
  }
  if (zone.level >= ZONE_THRIVING_LEVEL) {
    return 'thriving';
  }
  if (zone.level >= ZONE_SHIMMER_MIN && zone.level < ZONE_SHIMMER_MAX) {
    return 'shimmer';
  }
  if (zone.level < ZONE_SHIMMER_MIN) {
    return 'absent';
  }
  return 'normal';
}

export function zoneIsThriving(zone: ZoneData): boolean {
  return zoneVisualMode(zone) === 'thriving';
}

export function zoneIsShimmer(zone: ZoneData): boolean {
  return zoneVisualMode(zone) === 'shimmer';
}
