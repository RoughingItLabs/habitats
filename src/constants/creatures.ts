import { CreatureSpecies, CreatureStage } from '../types/creature';
import { ZoneId } from '../types/zone';

export const CREATURE_ZONES: Record<CreatureSpecies, ZoneId> = {
  moon_fox:     'moongrove',
  dream_sprite: 'moongrove',
  ember_wolf:   'embertrail',
  fire_hare:    'embertrail',
  meadow_bunny: 'meadow',
  forest_deer:  'meadow',
  tide_otter:   'tidallagoon',
  cloud_sprite: 'zenclearing',
  rock_sprite:  'stonepeak',
};

// Stage size multipliers relative to base 100px
export const STAGE_SCALE: Record<CreatureStage, number> = {
  1: 0.45,
  2: 0.65,
  3: 0.82,
  4: 1.00,
  5: 1.15,
};

// XP thresholds to advance to next stage (cumulative activity level-days)
export const STAGE_XP_THRESHOLDS: Record<CreatureStage, number> = {
  1: 0.25,
  2: 0.50,
  3: 0.75,
  4: 1.00,
  5: 1.00, // Already at max
};
