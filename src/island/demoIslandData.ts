import { ZONE_DEFINITIONS } from '../constants/zones';
import type { Creature } from '../types/creature';
import type { ZoneData, ZoneId } from '../types/zone';
import { levelToZoneState } from '../engine/ZoneEngine';

function zone(
  id: ZoneId,
  level: number,
  isNeglected = false
): ZoneData {
  const def = ZONE_DEFINITIONS[id];
  return {
    id,
    activityType: def.activityType,
    level,
    state: levelToZoneState(level),
    lastUpdated: new Date(),
    peakLevelEver: level,
    isNeglected,
  };
}

/** Preview island state for device builds and simulators. */
export function getDemoZones(): Partial<Record<ZoneId, ZoneData>> {
  return {
    moongrove: zone('moongrove', 0.78),
    meadow: zone('meadow', 0.52),
    embertrail: zone('embertrail', 0.41),
    tidallagoon: zone('tidallagoon', 0.35),
    zenclearing: zone('zenclearing', 0.28),
    stonepeak: zone('stonepeak', 0.18, true),
  };
}

export const DEMO_CREATURES: Creature[] = [
  {
    id: 'demo-moon-fox',
    species: 'moon_fox',
    name: 'Lunara',
    stage: 3,
    zoneId: 'moongrove',
    xpProgress: 0.4,
    isLegendary: false,
    hasGraduated: false,
    discoveredAt: new Date(),
  },
  {
    id: 'demo-meadow-bunny',
    species: 'meadow_bunny',
    name: 'Clover',
    stage: 2,
    zoneId: 'meadow',
    xpProgress: 0.2,
    isLegendary: false,
    hasGraduated: false,
    discoveredAt: new Date(),
  },
];

export const DEMO_ISLAND_SCALE = 0.92;
