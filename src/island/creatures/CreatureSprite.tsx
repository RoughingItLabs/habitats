/**
 * CreatureSprite — wandering creature with stage scale and drop shadow.
 */
import React, { useMemo } from 'react';
import { Group, Oval } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { Creature } from '../../types/creature';
import {
  creatureShadowDimensions,
  creatureSpriteSizePx,
  CREATURE_SHADOW_OPACITY,
} from './creatureSpriteLogic';
import { CreatureSpeciesSprite } from './CreatureSpeciesSprite';
import { useWanderBehavior } from './WanderBehavior';
import { zoneBoundsFromZoneId } from './wanderBehaviorLogic';
import { vbX, vbY, type ViewBoxLayout } from '../viewBox';

export interface CreatureSpriteProps {
  creature: Creature;
  zoneIsNeglected: boolean;
  layout: ViewBoxLayout;
}

const SHADOW_COLOR = '#1a1030';

export function CreatureSprite({
  creature,
  zoneIsNeglected,
  layout,
}: CreatureSpriteProps) {
  const zoneBounds = useMemo(
    () => zoneBoundsFromZoneId(creature.zoneId),
    [creature.zoneId]
  );
  const { x, y, bobOffsetPx, facingDirection } = useWanderBehavior({
    zoneBounds,
    isNeglected: zoneIsNeglected,
  });

  const spriteSize = creatureSpriteSizePx(creature.stage);
  const shadow = creatureShadowDimensions(spriteSize);

  const transform = useDerivedValue(() => {
    const px = vbX(x.value, layout);
    const py = vbY(y.value, layout) + bobOffsetPx.value;
    return [
      { translateX: px },
      { translateY: py },
      { scaleX: facingDirection.value },
    ];
  });

  const shadowX = useDerivedValue(
    () => vbX(x.value, layout) - shadow.rx
  );
  const shadowY = useDerivedValue(
    () => vbY(y.value, layout) + shadow.offsetY - shadow.ry
  );

  return (
    <Group>
      <Oval
        x={shadowX}
        y={shadowY}
        width={shadow.rx * 2}
        height={shadow.ry * 2}
        color={SHADOW_COLOR}
        opacity={CREATURE_SHADOW_OPACITY}
      />
      <Group transform={transform}>
        <CreatureSpeciesSprite
          species={creature.species}
          stage={creature.stage}
          size={spriteSize}
        />
      </Group>
    </Group>
  );
}
