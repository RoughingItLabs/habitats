import { ZONE_DEFINITIONS } from '../../../constants/zones';
import {
  facingDirectionFromDelta,
  initialWanderPosition,
  lerpPosition,
  pickIdleDurationMs,
  pickWanderIntervalMs,
  randomTargetInBounds,
  shouldEnterIdle,
  verticalBobOffset,
  wanderMoveDurationMs,
  wanderSpeedFactor,
  WANDER_BOB_AMPLITUDE_PX,
  WANDER_IDLE_CHANCE,
  WANDER_IDLE_MAX_MS,
  WANDER_IDLE_MIN_MS,
  WANDER_INTERVAL_MAX_MS,
  WANDER_INTERVAL_MIN_MS,
  WANDER_NEGLECT_SPEED_FACTOR,
  zoneBoundsFromZoneId,
} from '../wanderBehaviorLogic';

describe('wanderBehaviorLogic', () => {
  const bounds = { x: 10, y: 20, w: 30, h: 25 };
  const seq = (values: number[]) => {
    let i = 0;
    return () => values[i++ % values.length]!;
  };

  describe('brief constants', () => {
    it('uses 2500–5000ms retarget intervals', () => {
      expect(WANDER_INTERVAL_MIN_MS).toBe(2500);
      expect(WANDER_INTERVAL_MAX_MS).toBe(5000);
      const rng = seq([0, 1, 0.5]);
      expect(pickWanderIntervalMs(rng)).toBe(2500);
      expect(pickWanderIntervalMs(rng)).toBe(5000);
      expect(pickWanderIntervalMs(rng)).toBe(3750);
    });

    it('uses 0.3x speed when neglected', () => {
      expect(WANDER_NEGLECT_SPEED_FACTOR).toBe(0.3);
      expect(wanderSpeedFactor({ isNeglected: true })).toBe(0.3);
      expect(wanderSpeedFactor({ isNeglected: false })).toBe(1);
    });

    it('uses 15% idle chance for 1–3 second pauses', () => {
      expect(WANDER_IDLE_CHANCE).toBe(0.15);
      expect(WANDER_IDLE_MIN_MS).toBe(1000);
      expect(WANDER_IDLE_MAX_MS).toBe(3000);
      expect(shouldEnterIdle(() => 0.14, false)).toBe(true);
      expect(shouldEnterIdle(() => 0.15, false)).toBe(false);
      expect(pickIdleDurationMs(() => 0)).toBe(1000);
      expect(pickIdleDurationMs(() => 1)).toBe(3000);
    });

    it('bob amplitude is 1.5px', () => {
      expect(WANDER_BOB_AMPLITUDE_PX).toBe(1.5);
      expect(verticalBobOffset(Math.PI / 2)).toBeCloseTo(1.5);
      expect(verticalBobOffset(0)).toBeCloseTo(0);
      expect(verticalBobOffset(Math.PI)).toBeCloseTo(0, 5);
    });
  });

  describe('zoneBoundsFromZoneId', () => {
    it('maps moongrove to zone definition bounds', () => {
      const def = ZONE_DEFINITIONS.moongrove;
      expect(zoneBoundsFromZoneId('moongrove')).toEqual({
        x: def.basePosition.x,
        y: def.basePosition.y,
        w: def.baseSize.w,
        h: def.baseSize.h,
      });
    });
  });

  describe('randomTargetInBounds', () => {
    it('keeps targets inside padded bounds', () => {
      const target = randomTargetInBounds(bounds, 0.1, () => 0.5);
      expect(target.x).toBeGreaterThanOrEqual(bounds.x + 3);
      expect(target.x).toBeLessThanOrEqual(bounds.x + bounds.w - 3);
      expect(target.y).toBeGreaterThanOrEqual(bounds.y + 2.5);
      expect(target.y).toBeLessThanOrEqual(bounds.y + bounds.h - 2.5);
    });
  });

  describe('facingDirectionFromDelta', () => {
    it('faces left when moving left', () => {
      expect(facingDirectionFromDelta(-1)).toBe(-1);
      expect(facingDirectionFromDelta(0)).toBe(1);
      expect(facingDirectionFromDelta(2)).toBe(1);
    });
  });

  describe('wanderMoveDurationMs', () => {
    it('takes longer to cross the same distance when neglected', () => {
      const from = { x: 10, y: 10 };
      const to = { x: 30, y: 10 };
      const normal = wanderMoveDurationMs(from, to, { isNeglected: false });
      const neglected = wanderMoveDurationMs(from, to, { isNeglected: true });
      expect(neglected).toBeGreaterThan(normal);
      expect(neglected / normal).toBeCloseTo(1 / WANDER_NEGLECT_SPEED_FACTOR, 5);
    });

    it('returns minimum interval when already at target', () => {
      const point = { x: 15, y: 15 };
      expect(wanderMoveDurationMs(point, point, { isNeglected: false })).toBe(
        WANDER_INTERVAL_MIN_MS
      );
    });
  });

  describe('lerpPosition', () => {
    it('clamps progress and interpolates', () => {
      expect(lerpPosition({ x: 0, y: 0 }, { x: 10, y: 20 }, 0.5)).toEqual({
        x: 5,
        y: 10,
      });
      expect(lerpPosition({ x: 0, y: 0 }, { x: 10, y: 10 }, 2)).toEqual({
        x: 10,
        y: 10,
      });
    });
  });

  describe('initialWanderPosition', () => {
    it('starts at zone center', () => {
      expect(initialWanderPosition(bounds)).toEqual({
        x: 25,
        y: 32.5,
      });
    });
  });
});
