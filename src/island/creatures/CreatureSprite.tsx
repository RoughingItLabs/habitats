/**
 * CreatureSprite — wandering creature with stage scale and drop shadow.
 */
import React, { useEffect, useMemo } from 'react';
import { BlurMask, Circle, Group, Oval } from '@shopify/react-native-skia';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { Creature } from '../../types/creature';
import type { TimeOfDay } from '../../engine/TimeEngine';
import type { ZoneData } from '../../types/zone';
import { isMoonGroveDayRest, isMoonGroveNightTime } from '../zones/moonGroveNightLogic';
import { zoneIsThriving } from '../zones/zoneVisualState';
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
  zone: ZoneData;
  timeOfDay: TimeOfDay;
  layout: ViewBoxLayout;
}

const SHADOW_COLOR = '#1a1030';
const MOON_FOX_GLOW = '#C4B5D9';

export function CreatureSprite({
  creature,
  zone,
  timeOfDay,
  layout,
}: CreatureSpriteProps) {
  const zoneBounds = useMemo(
    () => zoneBoundsFromZoneId(creature.zoneId),
    [creature.zoneId]
  );
  const isThriving = zoneIsThriving(zone);
  const nocturnalDayRest =
    creature.zoneId === 'moongrove' && isMoonGroveDayRest(timeOfDay);

  const { x, y, bobOffsetPx, facingDirection } = useWanderBehavior({
    zoneBounds,
    isNeglected: zone.isNeglected,
    isThriving,
    nocturnalDayRest,
  });

  const spriteSize = creatureSpriteSizePx(creature.stage);
  const shadow = creatureShadowDimensions(spriteSize);

  const showMoonFoxGlow =
    creature.species === 'moon_fox' &&
    creature.zoneId === 'moongrove' &&
    isMoonGroveNightTime(timeOfDay);

  const glowPulse = useSharedValue(0);

  useEffect(() => {
    if (!showMoonFoxGlow) {
      return;
    }
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [glowPulse, showMoonFoxGlow]);

  const glowOpacity = useDerivedValue(() =>
    showMoonFoxGlow ? 0.15 + glowPulse.value * 0.1 : 0
  );

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

  const glowR = spriteSize * 0.65;
  const glowCx = useDerivedValue(() => vbX(x.value, layout));
  const glowCy = useDerivedValue(
    () => vbY(y.value, layout) + shadow.offsetY * 0.5
  );

  return (
    <Group>
      {showMoonFoxGlow ? (
        <Circle
          cx={glowCx}
          cy={glowCy}
          r={glowR}
          color={MOON_FOX_GLOW}
          opacity={glowOpacity}
        >
          <BlurMask blur={8} style="normal" />
        </Circle>
      ) : null}
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
