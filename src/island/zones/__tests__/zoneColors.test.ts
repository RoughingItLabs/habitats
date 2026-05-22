import {
  applyNeglectedColor,
  mixHex,
  smoothstep,
  zoneLayerOpacity,
} from '../zoneColors';

describe('zoneColors', () => {
  describe('smoothstep', () => {
    it('returns 0 before edge0 and 1 after edge1', () => {
      expect(smoothstep(0, 1, -1)).toBe(0);
      expect(smoothstep(0, 1, 2)).toBe(1);
    });

    it('returns 0.5 at the midpoint', () => {
      expect(smoothstep(0, 1, 0.5)).toBe(0.5);
    });
  });

  describe('zoneLayerOpacity', () => {
    it('is zero below shimmer threshold', () => {
      expect(zoneLayerOpacity(0.02, 0.03, 0.12)).toBe(0);
    });

    it('ramps terrain in between 0.12 and 0.35', () => {
      expect(zoneLayerOpacity(0.12, 0.12, 0.35)).toBe(0);
      expect(zoneLayerOpacity(0.235, 0.12, 0.35)).toBeCloseTo(0.5, 1);
      expect(zoneLayerOpacity(0.35, 0.12, 0.35)).toBe(1);
    });
  });

  describe('mixHex', () => {
    it('returns the first color at t=0', () => {
      expect(mixHex('#000000', '#FFFFFF', 0)).toBe('#000000');
    });

    it('returns the second color at t=1', () => {
      expect(mixHex('#000000', '#FFFFFF', 1)).toBe('#ffffff');
    });
  });

  describe('applyNeglectedColor', () => {
    it('leaves color unchanged when not neglected', () => {
      expect(applyNeglectedColor('#4A3A7A', false)).toBe('#4A3A7A');
    });

    it('desaturates and tints when neglected', () => {
      const result = applyNeglectedColor('#4A3A7A', true);
      expect(result).not.toBe('#4A3A7A');
      expect(result).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});
