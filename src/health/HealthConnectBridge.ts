/**
 * HealthConnectBridge.ts
 * Android Health Connect integration.
 *
 * Runtime API: react-native-health-connect (expo-health-connect is config-plugin only).
 */
import { Platform } from 'react-native';
import {
  initialize,
  requestPermission,
  readRecords,
  getSdkStatus,
  SdkAvailabilityStatus,
  SleepStageType,
  ExerciseType,
} from 'react-native-health-connect';
import { ActivityType, DailyActivity } from '../types/activity';
import type { HealthBridge } from './HealthBridge';
import type { NormalizedHealthData } from './HealthNormalizer';

const SOURCE = 'health_connect';

const READ_PERMISSIONS = [
  { accessType: 'read' as const, recordType: 'Steps' as const },
  { accessType: 'read' as const, recordType: 'SleepSession' as const },
  { accessType: 'read' as const, recordType: 'Distance' as const },
  { accessType: 'read' as const, recordType: 'ExerciseSession' as const },
];

const ASLEEP_SLEEP_STAGES = new Set<number>([
  SleepStageType.SLEEPING,
  SleepStageType.LIGHT,
  SleepStageType.DEEP,
  SleepStageType.REM,
]);

const STRENGTH_EXERCISE_TYPES = new Set<number>([
  ExerciseType.STRENGTH_TRAINING,
  ExerciseType.WEIGHTLIFTING,
  ExerciseType.BENCH_PRESS,
  ExerciseType.DEADLIFT,
  ExerciseType.SQUAT,
]);

const MINDFULNESS_EXERCISE_TYPES = new Set<number>([
  ExerciseType.GUIDED_BREATHING,
  ExerciseType.YOGA,
  ExerciseType.PILATES,
]);

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0] as string;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function sessionMinutes(startTime: string, endTime: string): number {
  const ms =
    new Date(endTime).getTime() - new Date(startTime).getTime();
  return Math.max(0, ms / 60_000);
}

function addDailyValue(
  bucket: Map<string, Map<ActivityType, number>>,
  date: string,
  type: ActivityType,
  value: number
): void {
  if (!bucket.has(date)) {
    bucket.set(date, new Map());
  }
  const day = bucket.get(date)!;
  day.set(type, (day.get(type) ?? 0) + value);
}

function bucketToActivities(
  bucket: Map<string, Map<ActivityType, number>>,
  unitForType: (type: ActivityType) => string
): DailyActivity[] {
  const activities: DailyActivity[] = [];
  for (const [date, types] of bucket) {
    for (const [type, value] of types) {
      if (value > 0) {
        activities.push({
          date,
          type,
          value,
          unit: unitForType(type),
          source: SOURCE,
        });
      }
    }
  }
  return activities;
}

function unitForActivityType(type: ActivityType): string {
  switch (type) {
    case 'steps':
      return 'count';
    case 'sleep':
    case 'mindfulness':
      return 'min';
    case 'strength':
      return 'sessions';
    case 'running':
    case 'swimming':
    case 'cycling':
      return 'm';
    default:
      return 'count';
  }
}

async function ensureInitialized(): Promise<boolean> {
  try {
    return await initialize();
  } catch {
    return false;
  }
}

export const healthConnectBridge: HealthBridge = {
  async isAvailable(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;
    try {
      const status = await getSdkStatus();
      return status === SdkAvailabilityStatus.SDK_AVAILABLE;
    } catch {
      return false;
    }
  },

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;
    if (!(await this.isAvailable())) return false;
    if (!(await ensureInitialized())) return false;

    try {
      const granted = await requestPermission(READ_PERMISSIONS);
      const grantedTypes = new Set(
        granted.map(p => ('recordType' in p ? p.recordType : null))
      );
      return READ_PERMISSIONS.every(p => grantedTypes.has(p.recordType));
    } catch {
      return false;
    }
  },

  async fetchLast14Days(): Promise<NormalizedHealthData> {
    const fetchedAt = new Date();
    if (Platform.OS !== 'android') {
      return { fetchedAt, source: SOURCE, activities: [] };
    }

    const endTime = fetchedAt;
    const startTime = startOfDay(new Date(fetchedAt));
    startTime.setDate(startTime.getDate() - 14);

    const timeRangeFilter = {
      operator: 'between' as const,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };

    const bucket = new Map<string, Map<ActivityType, number>>();

    try {
      if (!(await ensureInitialized())) {
        return { fetchedAt, source: SOURCE, activities: [] };
      }

      const [stepsResult, sleepResult, distanceResult, exerciseResult] =
        await Promise.all([
          readRecords('Steps', { timeRangeFilter }),
          readRecords('SleepSession', { timeRangeFilter }),
          readRecords('Distance', { timeRangeFilter }),
          readRecords('ExerciseSession', { timeRangeFilter }),
        ]);

      for (const record of stepsResult.records) {
        const date = toDateString(new Date(record.startTime));
        addDailyValue(bucket, date, 'steps', record.count);
      }

      for (const record of sleepResult.records) {
        const date = toDateString(new Date(record.startTime));
        let minutes = 0;

        if (record.stages && record.stages.length > 0) {
          for (const stage of record.stages) {
            if (ASLEEP_SLEEP_STAGES.has(stage.stage)) {
              minutes += sessionMinutes(stage.startTime, stage.endTime);
            }
          }
        } else {
          minutes = sessionMinutes(record.startTime, record.endTime);
        }

        addDailyValue(bucket, date, 'sleep', minutes);
      }

      for (const record of distanceResult.records) {
        const date = toDateString(new Date(record.startTime));
        addDailyValue(bucket, date, 'running', record.distance.inMeters);
      }

      for (const record of exerciseResult.records) {
        const date = toDateString(new Date(record.startTime));
        const minutes = sessionMinutes(record.startTime, record.endTime);

        if (STRENGTH_EXERCISE_TYPES.has(record.exerciseType)) {
          addDailyValue(bucket, date, 'strength', 1);
        } else if (MINDFULNESS_EXERCISE_TYPES.has(record.exerciseType)) {
          addDailyValue(bucket, date, 'mindfulness', minutes);
        }
      }
    } catch {
      return { fetchedAt, source: SOURCE, activities: [] };
    }

    return {
      fetchedAt,
      source: SOURCE,
      activities: bucketToActivities(bucket, unitForActivityType),
    };
  },
};

export default healthConnectBridge;

/** @deprecated Use healthConnectBridge.requestPermissions() */
export async function requestHealthConnectPermissions(): Promise<boolean> {
  return healthConnectBridge.requestPermissions();
}

/** @deprecated Use healthConnectBridge.fetchLast14Days() */
export async function fetchHealthConnectData(
  startDate: Date,
  endDate: Date
): Promise<DailyActivity[]> {
  const data = await healthConnectBridge.fetchLast14Days();
  const start = toDateString(startDate);
  const end = toDateString(endDate);
  return data.activities.filter(a => a.date >= start && a.date <= end);
}
