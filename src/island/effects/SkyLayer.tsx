/**
 * SkyLayer — animated sky, ocean, stars, sun, moon (behind island).
 */
import React, { useEffect, useMemo } from 'react';
import {
  BlurMask,
  Circle,
  Fill,
  Group,
  LinearGradient,
  Oval,
  vec,
} from '@shopify/react-native-skia';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useIslandStore } from '../../store/islandStore';
import type { TimeOfDay } from '../../engine/TimeEngine';
import { useSkyColors } from '../hooks/useSkyColors';
import {
  buildOceanShimmers,
  buildStarField,
  OCEAN_SHIMMER_COUNT,
  OCEAN_SHIMMER_SEED,
  STAR_COUNT,
  STAR_FIELD_SEED,
  type OceanShimmerSeed,
  type StarSeed,
} from './skyLayerLogic';

interface SkyLayerProps {
  width: number;
  height: number;
}

function StarDot({
  star,
  fieldVisibility,
}: {
  star: StarSeed;
  fieldVisibility: { value: number };
}) {
  const opacity = useSharedValue(0.4 + star.phaseOffset * 0.3);

  useEffect(() => {
    const duration =
      star.twinkleMinMs + (star.twinkleMaxMs - star.twinkleMinMs) * 0.5;
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.15 + star.phaseOffset * 0.2, {
          duration,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(0.85 + star.phaseOffset * 0.15, {
          duration,
          easing: Easing.inOut(Easing.sin),
        })
      ),
      -1,
      true
    );
  }, [opacity, star]);

  const combinedOpacity = useDerivedValue(
    () => opacity.value * fieldVisibility.value
  );

  return (
    <Circle
      cx={star.x}
      cy={star.y}
      r={star.r}
      color="#FFFFFF"
      opacity={combinedOpacity}
    />
  );
}

function OceanShimmerLine({
  shimmer,
  oceanColor,
}: {
  shimmer: OceanShimmerSeed;
  oceanColor: { value: string };
}) {
  const drift = useSharedValue(0);

  useEffect(() => {
    drift.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: shimmer.durationMs,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(0, {
          duration: shimmer.durationMs,
          easing: Easing.inOut(Easing.sin),
        })
      ),
      -1,
      false
    );
  }, [drift, shimmer.durationMs]);

  const ovalX = useDerivedValue(() => {
    const offset =
      shimmer.driftMinPx +
      (shimmer.driftMaxPx - shimmer.driftMinPx) * drift.value;
    return shimmer.cx + offset - shimmer.rx;
  });

  return (
    <Oval
      x={ovalX}
      y={shimmer.cy - shimmer.ry}
      width={shimmer.rx * 2}
      height={shimmer.ry * 2}
      color={oceanColor}
      opacity={0.12}
    />
  );
}

function sunStyle(timeOfDay: TimeOfDay, width: number, height: number) {
  if (timeOfDay === 'afternoon') {
    return {
      cx: width * 0.78,
      cy: height * 0.28,
      r: width * 0.09,
      glow: 28,
      core: '#FFD166',
      glowColor: '#FF8C4288',
    };
  }
  return {
    cx: width * 0.82,
    cy: height * 0.16,
    r: width * 0.065,
    glow: 18,
    core: '#FFF8E8',
    glowColor: '#FFE8A060',
  };
}

function moonStyle(timeOfDay: TimeOfDay, width: number, height: number) {
  const isNight = timeOfDay === 'night';
  return {
    cx: width * 0.22,
    cy: height * (isNight ? 0.14 : 0.18),
    r: width * (isNight ? 0.055 : 0.045),
    glow: isNight ? 24 : 14,
    core: '#FFF8DC',
    glowColor: isNight ? '#E8D8FF55' : '#C4B5D940',
  };
}

export function SkyLayer({ width, height }: SkyLayerProps) {
  const timeOfDay = useIslandStore(state => state.timeOfDay);
  const sky = useSkyColors();

  const stars = useMemo(
    () => buildStarField(STAR_COUNT, STAR_FIELD_SEED, width, height),
    [width, height]
  );
  const shimmers = useMemo(
    () =>
      buildOceanShimmers(OCEAN_SHIMMER_COUNT, OCEAN_SHIMMER_SEED, width, height),
    [width, height]
  );

  const sun = sunStyle(timeOfDay, width, height);
  const moon = moonStyle(timeOfDay, width, height);
  const oceanBandTop = height * 0.68;

  const sunOpacity = useDerivedValue(
    () => sky.sunVisibility.value * (timeOfDay === 'dawn' ? 0.7 : 1)
  );
  const moonOpacity = useDerivedValue(() => sky.moonVisibility.value);

  const skyGradientColors = useDerivedValue(() => [
    sky.skyTop.value,
    sky.skyBottom.value,
  ]);
  const oceanGradientColors = useDerivedValue(() => [
    sky.oceanTop.value,
    sky.oceanBottom.value,
  ]);

  return (
    <Group>
      <Fill>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, oceanBandTop)}
          colors={skyGradientColors}
        />
      </Fill>

      <Fill>
        <LinearGradient
          start={vec(0, oceanBandTop)}
          end={vec(0, height)}
          colors={oceanGradientColors}
        />
      </Fill>

      <Group>
        {stars.map((star, index) => (
          <StarDot
            key={`star-${index}`}
            star={star}
            fieldVisibility={sky.starVisibility}
          />
        ))}
      </Group>

      <Group opacity={sunOpacity}>
        <Circle cx={sun.cx} cy={sun.cy} r={sun.r * 2.2} color={sun.glowColor}>
          <BlurMask blur={sun.glow} style="normal" />
        </Circle>
        <Circle cx={sun.cx} cy={sun.cy} r={sun.r} color={sun.core} />
      </Group>

      <Group opacity={moonOpacity}>
        <Circle cx={moon.cx} cy={moon.cy} r={moon.r * 2} color={moon.glowColor}>
          <BlurMask blur={moon.glow} style="normal" />
        </Circle>
        <Circle cx={moon.cx} cy={moon.cy} r={moon.r} color={moon.core} />
      </Group>

      <Group>
        {shimmers.map((shimmer, index) => (
          <OceanShimmerLine
            key={`shimmer-${index}`}
            shimmer={shimmer}
            oceanColor={sky.oceanBottom}
          />
        ))}
      </Group>
    </Group>
  );
}
