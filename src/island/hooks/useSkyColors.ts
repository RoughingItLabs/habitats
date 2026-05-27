import { useEffect } from 'react';
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import type { TimeOfDay } from '../../engine/TimeEngine';
import { useIslandStore } from '../../store/islandStore';

export interface SkyColorPalette {
  skyTop: string;
  skyBottom: string;
  oceanTop: string;
  oceanBottom: string;
}

export const SKY_PALETTES: Record<TimeOfDay, SkyColorPalette> = {
  dawn: {
    skyTop: '#1a0f3a',
    skyBottom: '#ff6b35',
    oceanTop: '#1a2a4a',
    oceanBottom: '#2a4a6a',
  },
  morning: {
    skyTop: '#87CEEB',
    skyBottom: '#b0e0ff',
    oceanTop: '#1a3a5a',
    oceanBottom: '#2a5a8a',
  },
  afternoon: {
    skyTop: '#FF8C42',
    skyBottom: '#FFD166',
    oceanTop: '#1a2a4a',
    oceanBottom: '#2a4a5a',
  },
  evening: {
    skyTop: '#2d1b69',
    skyBottom: '#8B5CF6',
    oceanTop: '#0a1a2a',
    oceanBottom: '#1a2a3a',
  },
  night: {
    skyTop: '#04021a',
    skyBottom: '#0d0828',
    oceanTop: '#040d18',
    oceanBottom: '#061220',
  },
};

const SKY_TRANSITION_MS = 90_000;

export interface SkyColors {
  skyTop: SharedValue<string>;
  skyBottom: SharedValue<string>;
  oceanTop: SharedValue<string>;
  oceanBottom: SharedValue<string>;
  /** 0–1 star field visibility (night/evening bright, dawn fading, day hidden). */
  starVisibility: SharedValue<number>;
  /** 0–1 sun visibility. */
  sunVisibility: SharedValue<number>;
  /** 0–1 moon visibility. */
  moonVisibility: SharedValue<number>;
}

function celestialVisibility(timeOfDay: TimeOfDay): {
  stars: number;
  sun: number;
  moon: number;
} {
  switch (timeOfDay) {
    case 'dawn':
      return { stars: 0.35, sun: 0.55, moon: 0.4 };
    case 'morning':
      return { stars: 0, sun: 1, moon: 0 };
    case 'afternoon':
      return { stars: 0, sun: 1, moon: 0 };
    case 'evening':
      return { stars: 0.75, sun: 0, moon: 0.85 };
    case 'night':
      return { stars: 1, sun: 0, moon: 1 };
    default:
      return { stars: 0, sun: 0, moon: 0 };
  }
}

export function useSkyColors(): SkyColors {
  const timeOfDay = useIslandStore(state => state.timeOfDay);
  const palette = SKY_PALETTES[timeOfDay];

  const skyTop = useSharedValue(palette.skyTop);
  const skyBottom = useSharedValue(palette.skyBottom);
  const oceanTop = useSharedValue(palette.oceanTop);
  const oceanBottom = useSharedValue(palette.oceanBottom);
  const starVisibility = useSharedValue(
    celestialVisibility(timeOfDay).stars
  );
  const sunVisibility = useSharedValue(celestialVisibility(timeOfDay).sun);
  const moonVisibility = useSharedValue(celestialVisibility(timeOfDay).moon);

  useEffect(() => {
    const next = SKY_PALETTES[timeOfDay];
    const timing = { duration: SKY_TRANSITION_MS };
    skyTop.value = withTiming(next.skyTop, timing);
    skyBottom.value = withTiming(next.skyBottom, timing);
    oceanTop.value = withTiming(next.oceanTop, timing);
    oceanBottom.value = withTiming(next.oceanBottom, timing);

    const celestial = celestialVisibility(timeOfDay);
    starVisibility.value = withTiming(celestial.stars, timing);
    sunVisibility.value = withTiming(celestial.sun, timing);
    moonVisibility.value = withTiming(celestial.moon, timing);
  }, [
    timeOfDay,
    skyTop,
    skyBottom,
    oceanTop,
    oceanBottom,
    starVisibility,
    sunVisibility,
    moonVisibility,
  ]);

  return {
    skyTop,
    skyBottom,
    oceanTop,
    oceanBottom,
    starVisibility,
    sunVisibility,
    moonVisibility,
  };
}

/** Read current sky colors on the UI thread (for non-Skia consumers). */
export function useSkyColorsDerived(sky: SkyColors) {
  return useDerivedValue(() => ({
    skyTop: sky.skyTop.value,
    skyBottom: sky.skyBottom.value,
    oceanTop: sky.oceanTop.value,
    oceanBottom: sky.oceanBottom.value,
  }));
}
