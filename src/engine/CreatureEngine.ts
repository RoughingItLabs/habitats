/**
 * CreatureEngine.ts
 * Creature stage progression, egg hatching logic, XP calculation.
 * Pure functions — no side effects.
 */
import { Creature, Egg, CreatureStage, CreatureSpecies } from '../types/creature';
import { ZoneData } from '../types/zone';
import { STAGE_XP_THRESHOLDS } from '../constants/creatures';

/** XP gained per day based on zone level */
export function calculateDailyXp(zoneLevel: number): number {
  return zoneLevel * 0.05; // Max 0.05 XP/day at level 1.0 → ~20 days to max stage
}

/** Advance creature stage if XP threshold reached */
export function advanceCreatureStage(creature: Creature): Creature {
  if (creature.stage >= 5) return creature;

  const threshold = STAGE_XP_THRESHOLDS[creature.stage];
  if (creature.xpProgress >= threshold) {
    const newStage = (creature.stage + 1) as CreatureStage;
    return {
      ...creature,
      stage: newStage,
      xpProgress: 0,
      isLegendary: newStage === 5,
    };
  }
  return creature;
}

/** Calculate egg hatch progress per day */
export function calculateEggProgress(egg: Egg, zoneLevel: number): number {
  const dailyProgress = 0.05 + zoneLevel * 0.05; // 5–10% per day
  return Math.min(egg.progress + dailyProgress, 1.0);
}

/** Check if egg is ready to hatch */
export function isEggReadyToHatch(egg: Egg): boolean {
  return egg.progress >= 1.0;
}

/** Determine which species can spawn in a zone based on its level */
export function canSpawnEgg(zoneLevel: number, existingEggs: Egg[]): boolean {
  // Eggs spawn when zone reaches seedling+ and there's no existing egg
  return zoneLevel >= 0.12 && existingEggs.length === 0;
}
