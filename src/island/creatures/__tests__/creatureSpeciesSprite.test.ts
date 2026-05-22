import { resolveCreatureSpriteSpecies } from '../creatureSpeciesSpriteLogic';

describe('resolveCreatureSpriteSpecies', () => {
  it('routes dream_sprite to moon_fox art', () => {
    expect(resolveCreatureSpriteSpecies('dream_sprite')).toBe('moon_fox');
  });

  it('routes fire_hare to ember_wolf art', () => {
    expect(resolveCreatureSpriteSpecies('fire_hare')).toBe('ember_wolf');
  });

  it('passes through species with their own sprite', () => {
    expect(resolveCreatureSpriteSpecies('meadow_bunny')).toBe('meadow_bunny');
  });
});
