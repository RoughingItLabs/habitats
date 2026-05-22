import { ZONE_DEFINITIONS } from '../../../constants/zones';
import {
  MOON_GROVE_CENTER,
  MOON_GROVE_COLORS,
  MOON_GROVE_GLOW_RADIUS,
  MOON_GROVE_INNER_RADIUS,
  MOON_GROVE_LEVEL_COLOR_INPUT,
  MOON_GROVE_PARTICLE_COUNT,
  MOON_GROVE_TERRAIN_RADIUS,
  MOON_GROVE_TREE_COUNT,
  moonGroveGlowOpacity,
  moonGroveLushOpacity,
  moonGroveTerrainOpacity,
  moonGroveTreesOpacity,
  moonGroveVisibleLayers,
  moonGroveVisualLevel,
} from '../moonGroveLogic';

describe('moonGroveLogic', () => {
  describe('MOON_GROVE_COLORS', () => {
    it('matches the brief palette', () => {
      expect(MOON_GROVE_COLORS).toEqual({
        primary: '#4A3A7A',
        mid: '#7A6AAA',
        light: '#C4B5D9',
        glow: '#E8D8FF',
      });
    });

    it('matches zone definition colors', () => {
      expect(MOON_GROVE_COLORS).toEqual(ZONE_DEFINITIONS.moongrove.colors);
    });
  });

  describe('geometry', () => {
    it('centers on basePosition + half baseSize', () => {
      const def = ZONE_DEFINITIONS.moongrove;
      expect(MOON_GROVE_CENTER).toEqual({
        cx: def.basePosition.x + def.baseSize.w / 2,
        cy: def.basePosition.y + def.baseSize.h / 2,
      });
    });

    it('sizes glow larger than terrain and inner light smaller', () => {
      expect(MOON_GROVE_GLOW_RADIUS.rx).toBeGreaterThan(
        MOON_GROVE_TERRAIN_RADIUS.rx
      );
      expect(MOON_GROVE_INNER_RADIUS.rx).toBeLessThan(
        MOON_GROVE_TERRAIN_RADIUS.rx
      );
    });

    it('renders four trees and six particles', () => {
      expect(MOON_GROVE_TREE_COUNT).toBe(4);
      expect(MOON_GROVE_PARTICLE_COUNT).toBe(6);
    });
  });

  describe('moonGroveVisualLevel', () => {
    it('never drops below peakLevelEver', () => {
      expect(moonGroveVisualLevel(0.2, 0.75)).toBe(0.75);
      expect(moonGroveVisualLevel(0.9, 0.5)).toBe(0.9);
    });
  });

  describe('layer opacities by brief tier', () => {
    it('is fully hidden below shimmer (0.03)', () => {
      expect(moonGroveGlowOpacity(0.02, 1)).toBe(0);
      expect(moonGroveTerrainOpacity(0.02)).toBe(0);
      expect(moonGroveTreesOpacity(0.02)).toBe(0);
      expect(moonGroveLushOpacity(0.02)).toBe(0);
    });

    it('shows only glow in shimmer band (0.03–0.12)', () => {
      const layers = moonGroveVisibleLayers(0.08);
      expect(layers.glow).toBe(true);
      expect(layers.terrain).toBe(false);
      expect(layers.trees).toBe(false);
      expect(layers.lush).toBe(false);
    });

    it('adds terrain in seedling band (0.12–0.35)', () => {
      const layers = moonGroveVisibleLayers(0.2);
      expect(layers.glow).toBe(true);
      expect(layers.terrain).toBe(true);
      expect(layers.trees).toBe(false);
      expect(layers.lush).toBe(false);
    });

    it('adds trees in growing band (0.35–0.70)', () => {
      const layers = moonGroveVisibleLayers(0.5);
      expect(layers.glow).toBe(true);
      expect(layers.terrain).toBe(true);
      expect(layers.trees).toBe(true);
      expect(layers.lush).toBe(false);
    });

    it('adds lush details at established (0.70+)', () => {
      const layers = moonGroveVisibleLayers(0.82);
      expect(layers.glow).toBe(true);
      expect(layers.terrain).toBe(true);
      expect(layers.trees).toBe(true);
      expect(layers.lush).toBe(true);
    });

    it('ramps terrain opacity between 0.12 and 0.35', () => {
      expect(moonGroveTerrainOpacity(0.12)).toBe(0);
      expect(moonGroveTerrainOpacity(0.235)).toBeCloseTo(0.5, 1);
      expect(moonGroveTerrainOpacity(0.35)).toBe(1);
    });

    it('pulses glow opacity with pulsePhase', () => {
      expect(moonGroveGlowOpacity(0.5, 0)).toBeLessThan(
        moonGroveGlowOpacity(0.5, 1)
      );
    });
  });

  describe('MOON_GROVE_LEVEL_COLOR_INPUT', () => {
    it('aligns color interpolation with terrain/tree/lush thresholds', () => {
      expect(MOON_GROVE_LEVEL_COLOR_INPUT).toEqual([0.12, 0.35, 0.7]);
    });
  });
});
