/**
 * Runtime accessor for the AppleHealthKit native module.
 * react-native-health's default export snapshots NativeModules at import time,
 * which breaks on RN 0.76+ lazy module loading.
 */
import { NativeModules, Platform } from 'react-native';
import HealthKit from 'react-native-health';

const { Activities, Observers, Permissions, Units } = HealthKit.Constants;

export const HealthKitPermissions = Permissions;
export const HealthKitUnits = Units;

type NativeCallback<T> = (error: string, result: T) => void;

export type AppleHealthKitNative = {
  isAvailable: (callback: NativeCallback<boolean>) => void;
  initHealthKit: (
    permissions: { permissions: { read: string[]; write: string[] } },
    callback: (error: string) => void
  ) => void;
  getDailyStepCountSamples: (
    options: Record<string, unknown>,
    callback: NativeCallback<unknown[]>
  ) => void;
  getSleepSamples: (
    options: Record<string, unknown>,
    callback: NativeCallback<unknown[]>
  ) => void;
  getDailyDistanceWalkingRunningSamples: (
    options: Record<string, unknown>,
    callback: NativeCallback<unknown[]>
  ) => void;
  getDailyDistanceCyclingSamples: (
    options: Record<string, unknown>,
    callback: NativeCallback<unknown[]>
  ) => void;
  getDailyDistanceSwimmingSamples: (
    options: Record<string, unknown>,
    callback: NativeCallback<unknown[]>
  ) => void;
  getMindfulSession: (
    options: Record<string, unknown>,
    callback: NativeCallback<unknown[]>
  ) => void;
  getWaterSamples: (
    options: Record<string, unknown>,
    callback: NativeCallback<unknown[]>
  ) => void;
  getAnchoredWorkouts: (
    options: Record<string, unknown>,
    callback: (error: { message?: string }, result: { data: unknown[] }) => void
  ) => void;
};

export function getAppleHealthKit(): AppleHealthKitNative | null {
  if (Platform.OS !== 'ios') return null;

  const modules = NativeModules as {
    AppleHealthKit?: AppleHealthKitNative;
    RCTAppleHealthKit?: AppleHealthKitNative;
  };

  return modules.AppleHealthKit ?? modules.RCTAppleHealthKit ?? null;
}

export function isAppleHealthKitLinked(): boolean {
  const kit = getAppleHealthKit();
  return typeof kit?.isAvailable === 'function';
}

/** JS-only constants (always available). */
export const HealthKitConstants = {
  Activities,
  Observers,
  Permissions,
  Units,
};
