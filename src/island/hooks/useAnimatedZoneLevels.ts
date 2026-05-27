import { useEffect, useMemo } from 'react';
import {
  makeMutable,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { ZONE_DEFINITIONS } from '../../constants/zones';
import type { ZoneData, ZoneId } from '../../types/zone';

const DEFAULT_DURATION_MS = 2000;

const ALL_ZONE_IDS = Object.keys(ZONE_DEFINITIONS) as ZoneId[];

export type AnimatedZoneLevels = Record<ZoneId, SharedValue<number>>;

export function useAnimatedZoneLevels(
  zones: Partial<Record<ZoneId, ZoneData>>,
  durationMs = DEFAULT_DURATION_MS
): AnimatedZoneLevels {
  const animatedLevels = useMemo(
    () =>
      Object.fromEntries(
        ALL_ZONE_IDS.map(id => [id, makeMutable(zones[id]?.level ?? 0)])
      ) as unknown as AnimatedZoneLevels,
    []
  );

  useEffect(() => {
    ALL_ZONE_IDS.forEach(id => {
      const target = zones[id]?.level ?? 0;
      animatedLevels[id].value = withTiming(target, { duration: durationMs });
    });
  }, [zones, durationMs, animatedLevels]);

  return animatedLevels;
}
