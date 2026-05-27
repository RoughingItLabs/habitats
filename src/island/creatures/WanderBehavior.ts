/**
 * WanderBehavior — smooth creature movement within zone bounds (Reanimated).
 */
import { useEffect, useRef } from 'react';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import {
  facingDirectionFromDelta,
  initialWanderPosition,
  pickIdleDurationMs,
  pickWanderIntervalMs,
  randomTargetInBounds,
  shouldEnterIdle,
  verticalBobOffset,
  wanderMoveDurationMs,
  WANDER_BOB_AMPLITUDE_PX,
  WANDER_BOB_PERIOD_MS,
  type ZoneBounds,
} from './wanderBehaviorLogic';

export type { ZoneBounds } from './wanderBehaviorLogic';

export interface WanderBehaviorOptions {
  zoneBounds: ZoneBounds;
  isNeglected: boolean;
  /** Injectable RNG (e.g. tests). Defaults to Math.random. */
  random?: () => number;
}

export interface WanderBehaviorResult {
  /** Position in 0–100 viewBox units. */
  x: SharedValue<number>;
  y: SharedValue<number>;
  /** Vertical bob offset in screen pixels. */
  bobOffsetPx: SharedValue<number>;
  /** -1 facing left, 1 facing right. */
  facingDirection: SharedValue<number>;
}

export function useWanderBehavior({
  zoneBounds,
  isNeglected,
  random = Math.random,
}: WanderBehaviorOptions): WanderBehaviorResult {
  const start = initialWanderPosition(zoneBounds);
  const x = useSharedValue(start.x);
  const y = useSharedValue(start.y);
  const facingDirection = useSharedValue<number>(1);
  const bobPhase = useSharedValue(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    bobPhase.value = withRepeat(
      withTiming(Math.PI * 2, { duration: WANDER_BOB_PERIOD_MS }),
      -1,
      false
    );
  }, [bobPhase]);

  const bobOffsetPx = useDerivedValue(() =>
    verticalBobOffset(bobPhase.value, WANDER_BOB_AMPLITUDE_PX)
  );

  useEffect(() => {
    mountedRef.current = true;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const clearAllTimeouts = () => {
      timeouts.forEach(id => clearTimeout(id));
      timeouts.length = 0;
    };

    const moveToTarget = (target: { x: number; y: number }) => {
      const from = { x: x.value, y: y.value };
      const dx = target.x - from.x;
      facingDirection.value = facingDirectionFromDelta(dx);
      const duration = wanderMoveDurationMs(from, target, isNeglected);
      x.value = withTiming(target.x, {
        duration,
        easing: Easing.inOut(Easing.quad),
      });
      y.value = withTiming(target.y, {
        duration,
        easing: Easing.inOut(Easing.quad),
      });
    };

    const pickAndMove = () => {
      if (!mountedRef.current) {
        return;
      }
      const target = randomTargetInBounds(zoneBounds, undefined, random);
      moveToTarget(target);
    };

    const scheduleRetarget = () => {
      if (!mountedRef.current) {
        return;
      }
      const intervalMs = pickWanderIntervalMs(random);
      const id = setTimeout(() => {
        if (!mountedRef.current) {
          return;
        }
        if (shouldEnterIdle(random)) {
          const idleMs = pickIdleDurationMs(random);
          const idleId = setTimeout(() => {
            pickAndMove();
            scheduleRetarget();
          }, idleMs);
          timeouts.push(idleId);
        } else {
          pickAndMove();
          scheduleRetarget();
        }
      }, intervalMs);
      timeouts.push(id);
    };

    pickAndMove();
    scheduleRetarget();

    return () => {
      mountedRef.current = false;
      clearAllTimeouts();
    };
  }, [zoneBounds, isNeglected, random, x, y, facingDirection]);

  return { x, y, bobOffsetPx, facingDirection };
}
