/**
 * MagicalMomentEngine.ts
 * Detects and queues magical moments — discovered, never announced.
 * No modals, no banners. Moments shimmer through the island naturally.
 */
import { ZoneData, ZoneId } from '../types/zone';
import { Creature, Egg } from '../types/creature';

export type MagicalMomentType =
  | 'zone_first_shimmer'
  | 'zone_thriving'
  | 'egg_appeared'
  | 'egg_hatching'
  | 'creature_legendary'
  | 'island_dawn'
  | 'island_full_bloom';

export interface MagicalMoment {
  type: MagicalMomentType;
  zoneId?: ZoneId;
  creatureId?: string;
  triggeredAt: Date;
}

export function detectMagicalMoments(
  previousZones: Record<ZoneId, ZoneData>,
  currentZones: Record<ZoneId, ZoneData>,
  creatures: Creature[],
  eggs: Egg[]
): MagicalMoment[] {
  const moments: MagicalMoment[] = [];
  const now = new Date();

  for (const [id, current] of Object.entries(currentZones)) {
    const zoneId = id as ZoneId;
    const previous = previousZones[zoneId];

    // Zone first appears
    if (previous?.state === 'absent' && current.state !== 'absent') {
      moments.push({ type: 'zone_first_shimmer', zoneId, triggeredAt: now });
    }
    // Zone reaches thriving
    if (previous?.state !== 'thriving' && current.state === 'thriving') {
      moments.push({ type: 'zone_thriving', zoneId, triggeredAt: now });
    }
  }

  // New egg on beach
  eggs.forEach(egg => {
    if (egg.progress === 0) {
      moments.push({ type: 'egg_appeared', triggeredAt: now });
    }
    if (egg.progress >= 0.9 && egg.progress < 1.0) {
      moments.push({ type: 'egg_hatching', triggeredAt: now });
    }
  });

  // Creature reaches legendary
  creatures.forEach(creature => {
    if (creature.isLegendary && creature.stage === 5) {
      moments.push({ type: 'creature_legendary', creatureId: creature.id, triggeredAt: now });
    }
  });

  return moments;
}
