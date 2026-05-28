import type { HealthInputOptions, HealthValue } from 'react-native-health';
import type { HKWorkoutQueriedSampleType } from 'react-native-health';
import {
  getAppleHealthKit,
  type AppleHealthKitNative,
} from './appleHealthKit';

function requireNativeMethod<K extends keyof AppleHealthKitNative>(
  method: K
): NonNullable<AppleHealthKitNative[K]> {
  const kit = getAppleHealthKit();
  const fn = kit?.[method];
  if (typeof fn !== 'function') {
    throw new Error(
      `AppleHealthKit.${String(method)} is not available. Rebuild the iOS dev client (expo run:ios) with react-native-health linked.`
    );
  }
  return fn.bind(kit) as NonNullable<AppleHealthKitNative[K]>;
}

export function promisifyHealth<T>(
  method: keyof AppleHealthKitNative,
  options: HealthInputOptions
): Promise<T> {
  const fn = requireNativeMethod(method) as (
    options: HealthInputOptions,
    callback: (err: string, results: T) => void
  ) => void;

  return new Promise((resolve, reject) => {
    fn(options, (err, results) => {
      if (err) reject(new Error(err));
      else resolve(results);
    });
  });
}

export function promisifyHealthAvailable(): Promise<boolean> {
  const kit = getAppleHealthKit();
  if (!kit || typeof kit.isAvailable !== 'function') {
    return Promise.resolve(false);
  }

  return new Promise(resolve => {
    kit.isAvailable((err, available) => {
      resolve(!err && available);
    });
  });
}

export function promisifyInitHealthKit(permissions: {
  permissions: { read: string[]; write: string[] };
}): Promise<void> {
  const fn = requireNativeMethod('initHealthKit');

  return new Promise((resolve, reject) => {
    fn(permissions, (err: string) => {
      if (err) reject(new Error(err));
      else resolve();
    });
  });
}

export function promisifyAnchoredWorkouts(
  options: HealthInputOptions
): Promise<HKWorkoutQueriedSampleType[]> {
  const kit = getAppleHealthKit();
  if (!kit || typeof kit.getAnchoredWorkouts !== 'function') {
    return Promise.resolve([]);
  }

  return new Promise((resolve, reject) => {
    kit.getAnchoredWorkouts(
      options as Record<string, unknown>,
      (err, results) => {
        if (err) reject(new Error(err.message ?? 'Workout fetch failed'));
        else resolve(results.data as HKWorkoutQueriedSampleType[]);
      }
    );
  });
}

export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0] as string;
}

export function sessionMinutes(startDate: string, endDate: string): number {
  const ms = new Date(endDate).getTime() - new Date(startDate).getTime();
  return Math.max(0, ms / 60_000);
}

export function isAsleepSleepValue(value: HealthValue['value']): boolean {
  const label = String(value).toUpperCase();
  if (label === 'INBED' || label === 'AWAKE') return false;
  return (
    label === 'ASLEEP' ||
    label === 'CORE' ||
    label === 'DEEP' ||
    label === 'REM'
  );
}
