/**
 * HealthKitBridge.ts
 * iOS HealthKit integration.
 * Requires react-native-health (install separately for bare workflow).
 */
import { DailyActivity } from '../types/activity';

// Read-only permissions — never write
export const HEALTHKIT_READ_PERMISSIONS = [
  'Steps',
  'SleepAnalysis',
  'Workout',
  'MindfulSession',
  'ActiveEnergyBurned',
  'DistanceWalkingRunning',
  'DistanceCycling',
  'DistanceSwimming',
  'DietaryWater',
] as const;

export async function requestHealthKitPermissions(): Promise<boolean> {
  // TODO: Implement with react-native-health
  // import AppleHealthKit from 'react-native-health';
  console.log('[HealthKit] Permission request — implement with react-native-health');
  return false;
}

export async function fetchHealthKitData(
  _startDate: Date,
  _endDate: Date
): Promise<DailyActivity[]> {
  // TODO: Query Steps, Sleep, Workouts, Mindfulness
  console.log('[HealthKit] Data fetch — implement with react-native-health');
  return [];
}
