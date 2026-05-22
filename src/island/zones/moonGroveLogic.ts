/**
 * Pure Moon Grove level + geometry logic (testable, worklet-safe).
 */
import { ZONE_DEFINITIONS } from '../../constants/zones';
import { zoneLayerOpacity } from './zoneColors';

const DEF = ZONE_DEFINITIONS.moongrove;

export const MOON_GROVE_SHIMMER_MIN = 0.03;
export const MOON_GROVE_GLOW_FADE_END = 0.12;
export const MOON_GROVE_TERRAIN_FADE = { start: 0.12, end: 0.35 } as const;
export const MOON_GROVE_TREES_FADE = { start: 0.35, end: 0.7 } as const;
export const MOON_GROVE_LUSH_FADE = { start: 0.7, end: 0.95 } as const;
export const MOON_GROVE_LEVEL_COLOR_INPUT = [0.12, 0.35, 0.7] as const;

export const MOON_GROVE_COLORS = DEF.colors;
export const MOON_GROVE_TREE_COUNT = 4;
export const MOON_GROVE_PARTICLE_COUNT = 6;

export const MOON_GROVE_CENTER = {
  cx: DEF.basePosition.x + DEF.baseSize.w / 2,
  cy: DEF.basePosition.y + DEF.baseSize.h / 2,
};

export const MOON_GROVE_TERRAIN_RADIUS = {
  rx: DEF.baseSize.w * 0.46,
  ry: DEF.baseSize.h * 0.44,
};

export const MOON_GROVE_GLOW_RADIUS = {
  rx: MOON_GROVE_TERRAIN_RADIUS.rx * 1.35,
  ry: MOON_GROVE_TERRAIN_RADIUS.ry * 1.35,
};

export const MOON_GROVE_INNER_RADIUS = {
  rx: MOON_GROVE_TERRAIN_RADIUS.rx * 0.42,
  ry: MOON_GROVE_TERRAIN_RADIUS.ry * 0.38,
};

export function moonGroveVisualLevel(
  level: number,
  peakLevelEver: number
): number {
  'worklet';
  return Math.max(level, peakLevelEver);
}

export function moonGroveGlowOpacity(level: number, pulsePhase: number): number {
  'worklet';
  if (level < MOON_GROVE_SHIMMER_MIN) {
    return 0;
  }
  const presence = zoneLayerOpacity(
    level,
    MOON_GROVE_SHIMMER_MIN,
    MOON_GROVE_GLOW_FADE_END
  );
  const pulse = 0.5 + 0.5 * pulsePhase;
  return presence * (0.35 + 0.65 * pulse);
}

export function moonGroveTerrainOpacity(level: number): number {
  'worklet';
  return zoneLayerOpacity(
    level,
    MOON_GROVE_TERRAIN_FADE.start,
    MOON_GROVE_TERRAIN_FADE.end
  );
}

export function moonGroveTreesOpacity(level: number): number {
  'worklet';
  return zoneLayerOpacity(
    level,
    MOON_GROVE_TREES_FADE.start,
    MOON_GROVE_TREES_FADE.end
  );
}

export function moonGroveLushOpacity(level: number): number {
  'worklet';
  return zoneLayerOpacity(
    level,
    MOON_GROVE_LUSH_FADE.start,
    MOON_GROVE_LUSH_FADE.end
  );
}

/** Brief tier visibility — opacities > 0 mean the layer contributes. */
export function moonGroveVisibleLayers(level: number): {
  glow: boolean;
  terrain: boolean;
  trees: boolean;
  lush: boolean;
} {
  return {
    glow: moonGroveGlowOpacity(level, 1) > 0,
    terrain: moonGroveTerrainOpacity(level) > 0,
    trees: moonGroveTreesOpacity(level) > 0,
    lush: moonGroveLushOpacity(level) > 0,
  };
}
