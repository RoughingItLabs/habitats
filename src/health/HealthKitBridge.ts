/**
 * HealthKitBridge.ts — iOS HealthKit via react-native-health
 */
import { Platform } from 'react-native';
import type { HealthValue } from 'react-native-health';
import type { HKWorkoutQueriedSampleType } from 'react-native-health';
import { ActivityType, DailyActivity } from '../types/activity';
import {
  HealthKitPermissions,
  HealthKitUnits,
  isAppleHealthKitLinked,
} from './appleHealthKit';
import type { HealthBridge } from './HealthBridge';
import type { NormalizedHealthData } from './HealthNormalizer';
import {
  isAsleepSleepValue,
  promisifyAnchoredWorkouts,
  promisifyHealth,
  promisifyHealthAvailable,
  promisifyInitHealthKit,
  sessionMinutes,
  toDateString,
} from './healthKitPromises';

const SOURCE = 'healthkit';

const READ_PERMISSIONS = {
  permissions: {
    read: [
      HealthKitPermissions.Steps,
      HealthKitPermissions.SleepAnalysis,
      HealthKitPermissions.Workout,
      HealthKitPermissions.MindfulSession,
      HealthKitPermissions.DistanceWalkingRunning,
      HealthKitPermissions.DistanceCycling,
      HealthKitPermissions.DistanceSwimming,
      HealthKitPermissions.Water,
    ],
    write: [] as string[],
  },
};

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDailyValue(
  bucket: Map<string, Map<ActivityType, number>>,
  date: string,
  type: ActivityType,
  value: number
): void {
  if (!bucket.has(date)) bucket.set(date, new Map());
  const day = bucket.get(date)!;
  day.set(type, (day.get(type) ?? 0) + value);
}

function bucketToActivities(
  bucket: Map<string, Map<ActivityType, number>>
): DailyActivity[] {
  const activities: DailyActivity[] = [];
  for (const [date, types] of bucket) {
    for (const [type, value] of types) {
      if (value > 0) {
        activities.push({
          date,
          type,
          value,
          unit:
            type === 'steps'
              ? 'count'
              : type === 'sleep' || type === 'mindfulness'
                ? 'min'
                : type === 'strength'
                  ? 'sessions'
                  : type === 'hydration'
                    ? 'cups'
                    : 'm',
          source: SOURCE,
        });
      }
    }
  }
  return activities;
}

const RUNNING_WORKOUTS = new Set([
  'Running',
  'Walking',
  'Hiking',
  'TrailRunning',
  'TreadmillRunning',
]);

const CYCLING_WORKOUTS = new Set(['Cycling', 'HandCycling']);

const SWIMMING_WORKOUTS = new Set([
  'Swimming',
  'OpenWaterSwimming',
  'PoolSwimming',
]);

const STRENGTH_WORKOUTS = new Set([
  'TraditionalStrengthTraining',
  'FunctionalStrengthTraining',
  'CoreTraining',
  'HighIntensityIntervalTraining',
  'CrossTraining',
  'Weightlifting',
]);

const MINDFUL_WORKOUTS = new Set([
  'MindAndBody',
  'Yoga',
  'Pilates',
  'Flexibility',
  'Cooldown',
  'PreparationAndRecovery',
]);

export const healthKitBridge: HealthBridge = {
  async isAvailable(): Promise<boolean> {
    if (Platform.OS !== 'ios') return false;
    if (!isAppleHealthKitLinked()) return false;
    return promisifyHealthAvailable();
  },

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'ios') return false;
    if (!isAppleHealthKitLinked()) return false;
    if (!(await this.isAvailable())) return false;
    try {
      await promisifyInitHealthKit(READ_PERMISSIONS);
      return true;
    } catch {
      return false;
    }
  },

  async fetchLast14Days(): Promise<NormalizedHealthData> {
    const fetchedAt = new Date();
    if (Platform.OS !== 'ios') {
      return { fetchedAt, source: SOURCE, activities: [] };
    }

    const endDate = fetchedAt;
    const startDate = startOfDay(new Date(fetchedAt));
    startDate.setDate(startDate.getDate() - 14);

    const options = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    const bucket = new Map<string, Map<ActivityType, number>>();

    try {
      const [
        stepSamples,
        sleepSamples,
        runningDistance,
        cyclingDistance,
        swimmingDistance,
        mindfulSamples,
        waterSamples,
        workouts,
      ] = await Promise.all([
        promisifyHealth<HealthValue[]>('getDailyStepCountSamples', options),
        promisifyHealth<HealthValue[]>('getSleepSamples', options),
        promisifyHealth<HealthValue[]>(
          'getDailyDistanceWalkingRunningSamples',
          { ...options, unit: HealthKitUnits.meter }
        ),
        promisifyHealth<HealthValue[]>('getDailyDistanceCyclingSamples', {
          ...options,
          unit: HealthKitUnits.meter,
        }),
        promisifyHealth<HealthValue[]>('getDailyDistanceSwimmingSamples', {
          ...options,
          unit: HealthKitUnits.meter,
        }),
        promisifyHealth<HealthValue[]>('getMindfulSession', options),
        promisifyHealth<HealthValue[]>('getWaterSamples', options),
        promisifyAnchoredWorkouts(options),
      ]);

      for (const sample of stepSamples) {
        const date = toDateString(new Date(sample.startDate));
        addDailyValue(bucket, date, 'steps', sample.value);
      }

      for (const sample of sleepSamples) {
        if (!isAsleepSleepValue(sample.value)) continue;
        const date = toDateString(new Date(sample.startDate));
        addDailyValue(
          bucket,
          date,
          'sleep',
          sessionMinutes(sample.startDate, sample.endDate)
        );
      }

      for (const sample of runningDistance) {
        const date = toDateString(new Date(sample.startDate));
        addDailyValue(bucket, date, 'running', sample.value);
      }

      for (const sample of cyclingDistance) {
        const date = toDateString(new Date(sample.startDate));
        addDailyValue(bucket, date, 'cycling', sample.value);
      }

      for (const sample of swimmingDistance) {
        const date = toDateString(new Date(sample.startDate));
        addDailyValue(bucket, date, 'swimming', sample.value);
      }

      for (const sample of mindfulSamples) {
        const date = toDateString(new Date(sample.startDate));
        addDailyValue(
          bucket,
          date,
          'mindfulness',
          sessionMinutes(sample.startDate, sample.endDate)
        );
      }

      for (const sample of waterSamples) {
        const date = toDateString(new Date(sample.startDate));
        const cups = sample.value * 4.22675;
        addDailyValue(bucket, date, 'hydration', cups);
      }

      for (const workout of workouts as HKWorkoutQueriedSampleType[]) {
        const date = toDateString(new Date(workout.start));
        const name = workout.activityName;

        if (RUNNING_WORKOUTS.has(name) && workout.distance > 0) {
          addDailyValue(bucket, date, 'running', workout.distance);
        } else if (CYCLING_WORKOUTS.has(name) && workout.distance > 0) {
          addDailyValue(bucket, date, 'cycling', workout.distance);
        } else if (SWIMMING_WORKOUTS.has(name) && workout.distance > 0) {
          addDailyValue(bucket, date, 'swimming', workout.distance);
        } else if (STRENGTH_WORKOUTS.has(name)) {
          addDailyValue(bucket, date, 'strength', 1);
        } else if (MINDFUL_WORKOUTS.has(name)) {
          addDailyValue(
            bucket,
            date,
            'mindfulness',
            workout.duration / 60
          );
        }
      }
    } catch {
      return { fetchedAt, source: SOURCE, activities: [] };
    }

    return {
      fetchedAt,
      source: SOURCE,
      activities: bucketToActivities(bucket),
    };
  },
};

export default healthKitBridge;

export const HEALTHKIT_READ_PERMISSIONS = READ_PERMISSIONS.permissions
  .read as readonly string[];

/** @deprecated Use healthKitBridge.requestPermissions() */
export async function requestHealthKitPermissions(): Promise<boolean> {
  return healthKitBridge.requestPermissions();
}

/** @deprecated Use healthKitBridge.fetchLast14Days() */
export async function fetchHealthKitData(
  startDate: Date,
  endDate: Date
): Promise<DailyActivity[]> {
  const data = await healthKitBridge.fetchLast14Days();
  const start = toDateString(startDate);
  const end = toDateString(endDate);
  return data.activities.filter(a => a.date >= start && a.date <= end);
}
