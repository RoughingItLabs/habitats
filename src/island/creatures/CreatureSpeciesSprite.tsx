/**
 * Maps creature species to SVG sprite components.
 */
import React from 'react';
import { Circle } from '@shopify/react-native-skia';
import type { CreatureSpecies, CreatureStage } from '../../types/creature';
import { hasDedicatedSprite } from './creatureSpriteLogic';
import { resolveCreatureSpriteSpecies } from './creatureSpeciesSpriteLogic';
import { EmberWolf } from './sprites/EmberWolf';
import { ForestDeer } from './sprites/ForestDeer';
import { MeadowBunny } from './sprites/MeadowBunny';
import { MoonFox } from './sprites/MoonFox';
import { TideOtter } from './sprites/TideOtter';

export interface CreatureSpeciesSpriteProps {
  species: CreatureSpecies;
  stage: CreatureStage;
  size: number;
}

const PLACEHOLDER_COLOR = '#8A7AAA';

export function CreatureSpeciesSprite({
  species,
  stage,
  size,
}: CreatureSpeciesSpriteProps) {
  const spriteSpecies = resolveCreatureSpriteSpecies(species);

  if (spriteSpecies === 'moon_fox') {
    return <MoonFox stage={stage} size={size} />;
  }
  if (spriteSpecies === 'ember_wolf') {
    return <EmberWolf stage={stage} size={size} />;
  }
  if (spriteSpecies === 'meadow_bunny') {
    return <MeadowBunny stage={stage} size={size} />;
  }
  if (spriteSpecies === 'forest_deer') {
    return <ForestDeer stage={stage} size={size} />;
  }
  if (spriteSpecies === 'tide_otter') {
    return <TideOtter stage={stage} size={size} />;
  }

  if (!hasDedicatedSprite(species)) {
    return (
      <Circle
        cx={0}
        cy={-size * 0.2}
        r={size * 0.28}
        color={PLACEHOLDER_COLOR}
        opacity={0.85}
      />
    );
  }

  return (
    <Circle
      cx={0}
      cy={-size * 0.2}
      r={size * 0.28}
      color={PLACEHOLDER_COLOR}
      opacity={0.85}
    />
  );
}
