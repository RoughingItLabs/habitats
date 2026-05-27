import type { TimeOfDay } from '../../engine/TimeEngine';

export function isMoonGroveNightTime(timeOfDay: TimeOfDay): boolean {
  return timeOfDay === 'evening' || timeOfDay === 'night';
}

export function isMoonGroveDayRest(timeOfDay: TimeOfDay): boolean {
  return timeOfDay === 'morning' || timeOfDay === 'afternoon';
}

/** Night: +30% brightness on zone palette. */
export function moonGroveNightBrightnessFactor(timeOfDay: TimeOfDay): number {
  return isMoonGroveNightTime(timeOfDay) ? 1.3 : 1;
}

/** Day rest: slightly dimmer than default. */
export function moonGroveDayDimFactor(timeOfDay: TimeOfDay): number {
  return isMoonGroveDayRest(timeOfDay) ? 0.88 : 1;
}

export function moonGroveShowsBioluminescence(timeOfDay: TimeOfDay): boolean {
  return isMoonGroveNightTime(timeOfDay);
}
