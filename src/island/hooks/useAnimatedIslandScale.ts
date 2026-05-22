import { useEffect } from 'react';
import {
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { clampIslandScale } from '../islandScale';

const DEFAULT_DURATION_MS = 2000;

export function useAnimatedIslandScale(
  islandScale: number,
  durationMs = DEFAULT_DURATION_MS
): SharedValue<number> {
  const animatedScale = useSharedValue(clampIslandScale(islandScale));

  useEffect(() => {
    animatedScale.value = withTiming(clampIslandScale(islandScale), {
      duration: durationMs,
    });
  }, [animatedScale, islandScale, durationMs]);

  return animatedScale;
}
