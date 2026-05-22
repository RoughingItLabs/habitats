/**
 * CreatureSprite.tsx
 * Base wandering creature component.
 * TODO (Prompt 5): Implement wandering + Skia sprite rendering.
 */
import React from 'react';
import { Creature } from '../../types/creature';

interface CreatureSpriteProps {
  creature: Creature;
  zoneIsNeglected: boolean;
}

export function CreatureSprite({ creature, zoneIsNeglected }: CreatureSpriteProps) {
  return null;
}
