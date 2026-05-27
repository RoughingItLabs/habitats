/**
 * Pure wandering AI helpers (testable, worklet-safe).
 */
import { ZONE_DEFINITIONS } from '../../constants/zones';
import type { ZoneId } from '../../types/zone';

export interface ZoneBounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const WANDER_INTERVAL_MIN_MS = 2500;
export const WANDER_INTERVAL_MAX_MS = 5000;
export const WANDER_NEGLECT_SPEED_FACTOR = 0.3;
export const WANDER_IDLE_CHANCE = 0.15;
export const WANDER_IDLE_MIN_MS = 1000;
export const WANDER_IDLE_MAX_MS = 3000;
export const WANDER_BOB_AMPLITUDE_PX = 1.5;
export const WANDER_BOB_PERIOD_MS = 2000;
export const WANDER_BOUNDS_PADDING = 0.12;
export const WANDER_BASE_SPEED_VB_PER_SEC = 9;

export function zoneBoundsFromZoneId(zoneId: ZoneId): ZoneBounds {
  const def = ZONE_DEFINITIONS[zoneId];
  return {
    x: def.basePosition.x,
    y: def.basePosition.y,
    w: def.baseSize.w,
    h: def.baseSize.h,
  };
}

export function randomInRange(
  min: number,
  max: number,
  rng: () => number = Math.random
): number {
  return min + rng() * (max - min);
}

export function pickWanderIntervalMs(rng: () => number = Math.random): number {
  return randomInRange(WANDER_INTERVAL_MIN_MS, WANDER_INTERVAL_MAX_MS, rng);
}

export function pickIdleDurationMs(rng: () => number = Math.random): number {
  return randomInRange(WANDER_IDLE_MIN_MS, WANDER_IDLE_MAX_MS, rng);
}

export function shouldEnterIdle(rng: () => number = Math.random): boolean {
  return rng() < WANDER_IDLE_CHANCE;
}

export function wanderSpeedFactor(isNeglected: boolean): number {
  return isNeglected ? WANDER_NEGLECT_SPEED_FACTOR : 1;
}

export function randomTargetInBounds(
  bounds: ZoneBounds,
  padding = WANDER_BOUNDS_PADDING,
  rng: () => number = Math.random
): { x: number; y: number } {
  const padX = bounds.w * padding;
  const padY = bounds.h * padding;
  const innerW = Math.max(0, bounds.w - 2 * padX);
  const innerH = Math.max(0, bounds.h - 2 * padY);
  return {
    x: bounds.x + padX + rng() * innerW,
    y: bounds.y + padY + rng() * innerH,
  };
}

export function facingDirectionFromDelta(dx: number): 1 | -1 {
  if (dx < 0) {
    return -1;
  }
  return 1;
}

export function verticalBobOffset(
  phaseRadians: number,
  amplitudePx = WANDER_BOB_AMPLITUDE_PX
): number {
  'worklet';
  return Math.sin(phaseRadians) * amplitudePx;
}

export function lerpPosition(
  from: { x: number; y: number },
  to: { x: number; y: number },
  progress: number
): { x: number; y: number } {
  const t = Math.min(1, Math.max(0, progress));
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
  };
}

export function wanderMoveDurationMs(
  from: { x: number; y: number },
  to: { x: number; y: number },
  isNeglected: boolean,
  baseSpeedVbPerSec = WANDER_BASE_SPEED_VB_PER_SEC
): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const speed = baseSpeedVbPerSec * wanderSpeedFactor(isNeglected);
  if (speed <= 0 || distance === 0) {
    return WANDER_INTERVAL_MIN_MS;
  }
  return Math.max(400, (distance / speed) * 1000);
}

export function initialWanderPosition(bounds: ZoneBounds): { x: number; y: number } {
  return {
    x: bounds.x + bounds.w / 2,
    y: bounds.y + bounds.h / 2,
  };
}
