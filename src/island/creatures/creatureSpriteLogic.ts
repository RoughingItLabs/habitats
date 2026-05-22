/**
 * Pure CreatureSprite layout helpers (testable).
 */
import { STAGE_SCALE } from '../../constants/creatures';
import type { CreatureSpecies, CreatureStage } from '../../types/creature';

export const CREATURE_BASE_SPRITE_PX = 100;
export const CREATURE_SHADOW_RX_FACTOR = 0.38;
export const CREATURE_SHADOW_RY_FACTOR = 0.11;
export const CREATURE_SHADOW_OPACITY = 0.22;
export const CREATURE_SHADOW_OFFSET_Y_FACTOR = 0.42;

/** Species with a dedicated SVG sprite component in sprites/. */
export const CREATURES_WITH_SPRITES: readonly CreatureSpecies[] = [
  'moon_fox',
  'ember_wolf',
  'meadow_bunny',
  'forest_deer',
  'tide_otter',
] as const;

export function creatureStageScale(stage: CreatureStage): number {
  return STAGE_SCALE[stage];
}

export function creatureSpriteSizePx(
  stage: CreatureStage,
  basePx = CREATURE_BASE_SPRITE_PX
): number {
  return basePx * creatureStageScale(stage);
}

export function creatureShadowDimensions(spriteSizePx: number): {
  rx: number;
  ry: number;
  offsetY: number;
} {
  return {
    rx: spriteSizePx * CREATURE_SHADOW_RX_FACTOR,
    ry: spriteSizePx * CREATURE_SHADOW_RY_FACTOR,
    offsetY: spriteSizePx * CREATURE_SHADOW_OFFSET_Y_FACTOR,
  };
}

export function hasDedicatedSprite(species: CreatureSpecies): boolean {
  return (CREATURES_WITH_SPRITES as readonly string[]).includes(species);
}

export function minMaxStageScale(): { min: number; max: number } {
  const scales = Object.values(STAGE_SCALE) as number[];
  return { min: Math.min(...scales), max: Math.max(...scales) };
}
