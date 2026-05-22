import { STAGE_SCALE } from '../../../constants/creatures';
import {
  creatureShadowDimensions,
  creatureSpriteSizePx,
  creatureStageScale,
  CREATURE_BASE_SPRITE_PX,
  CREATURES_WITH_SPRITES,
  hasDedicatedSprite,
  minMaxStageScale,
} from '../creatureSpriteLogic';

describe('creatureSpriteLogic', () => {
  describe('STAGE_SCALE (brief: 0.55x – 1.25x)', () => {
    it('scales from hatchling to legendary per prompt 5', () => {
      expect(STAGE_SCALE[1]).toBe(0.55);
      expect(STAGE_SCALE[5]).toBe(1.25);
      expect(minMaxStageScale()).toEqual({ min: 0.55, max: 1.25 });
    });
  });

  describe('creatureSpriteSizePx', () => {
    it('multiplies base size by stage scale', () => {
      expect(creatureSpriteSizePx(1)).toBe(CREATURE_BASE_SPRITE_PX * 0.55);
      expect(creatureSpriteSizePx(5)).toBe(CREATURE_BASE_SPRITE_PX * 1.25);
    });

    it('matches creatureStageScale', () => {
      expect(creatureSpriteSizePx(3)).toBe(
        CREATURE_BASE_SPRITE_PX * creatureStageScale(3)
      );
    });
  });

  describe('creatureShadowDimensions', () => {
    it('returns ellipse dimensions proportional to sprite size', () => {
      const size = 100;
      const shadow = creatureShadowDimensions(size);
      expect(shadow.rx).toBeGreaterThan(shadow.ry);
      expect(shadow.offsetY).toBeGreaterThan(0);
    });
  });

  describe('hasDedicatedSprite', () => {
    it('lists species with SVG sprite components', () => {
      expect(CREATURES_WITH_SPRITES).toContain('moon_fox');
      expect(CREATURES_WITH_SPRITES).toContain('tide_otter');
      expect(hasDedicatedSprite('moon_fox')).toBe(true);
      expect(hasDedicatedSprite('dream_sprite')).toBe(false);
      expect(hasDedicatedSprite('cloud_sprite')).toBe(false);
    });
  });
});
