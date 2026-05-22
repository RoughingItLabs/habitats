import type { CreatureSpecies } from '../../types/creature';

/** Species that share another creature's SVG sprite asset. */
const SPRITE_ALIASES: Partial<Record<CreatureSpecies, CreatureSpecies>> = {
  dream_sprite: 'moon_fox',
  fire_hare: 'ember_wolf',
};

export function resolveCreatureSpriteSpecies(
  species: CreatureSpecies
): CreatureSpecies {
  return SPRITE_ALIASES[species] ?? species;
}
