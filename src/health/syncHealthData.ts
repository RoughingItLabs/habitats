import { Platform } from 'react-native';
import { calculateIslandScale } from '../engine/ZoneEngine';
import { ZONE_DEFINITIONS } from '../constants/zones';
import type { ActivityType } from '../types/activity';
import { useHealthStore } from '../store/healthStore';
import { useIslandStore } from '../store/islandStore';
import { isAppleHealthKitLinked } from './appleHealthKit';
import { getHealthBridge, getHealthPlatformLabel } from './getHealthBridge';
import { normalizeToActivitySummaries } from './HealthNormalizer';

export type SyncHealthStatus =
  | 'idle'
  | 'checking'
  | 'requesting_permissions'
  | 'fetching'
  | 'success'
  | 'error';

export interface SyncHealthOutcome {
  status: SyncHealthStatus;
  message: string;
  activityCount: number;
  summaryCount: number;
}

export async function syncHealthData(
  requestPermissionIfNeeded: boolean
): Promise<SyncHealthOutcome> {
  const bridge = getHealthBridge();
  const today = new Date();

  if (Platform.OS === 'ios' && !isAppleHealthKitLinked()) {
    return {
      status: 'error',
      message:
        'Apple Health native module is not linked. Run: npx expo run:ios --device (not Expo Go), then try again.',
      activityCount: 0,
      summaryCount: 0,
    };
  }

  const available = await bridge.isAvailable();
  if (!available) {
    return {
      status: 'error',
      message: `Health data is not available on this device. Check ${getHealthPlatformLabel()} is installed and permissions are enabled, then rebuild the dev client.`,
      activityCount: 0,
      summaryCount: 0,
    };
  }

  if (requestPermissionIfNeeded) {
    const granted = await bridge.requestPermissions();
    useHealthStore.getState().setHealthPermissionGranted(granted);
    if (!granted) {
      return {
        status: 'error',
        message: 'Health permissions were not granted.',
        activityCount: 0,
        summaryCount: 0,
      };
    }
  }

  const data = await bridge.fetchLast14Days();
  const summaries = normalizeToActivitySummaries(data.activities, today);

  useHealthStore.getState().setRawActivities(data.activities);
  useHealthStore.getState().setActivitySummaries(summaries);
  useHealthStore.getState().setLastFetchedAt(data.fetchedAt);
  useHealthStore.getState().setHealthPermissionGranted(true);

  useIslandStore.getState().updateZones(summaries);
  useIslandStore.getState().setLastSynced(data.fetchedAt);

  const levels = Object.fromEntries(
    (Object.values(ZONE_DEFINITIONS).map(d => d.activityType) as ActivityType[]).map(
      type => [
        type,
        summaries.find(s => s.type === type)?.level ?? 0,
      ]
    )
  ) as Record<ActivityType, number>;

  useIslandStore.getState().setIslandScale(calculateIslandScale(levels));

  if (data.activities.length === 0) {
    return {
      status: 'error',
      message:
        'Connected, but no activity records were returned for the last 14 days. Check that your health app has data in that range.',
      activityCount: 0,
      summaryCount: summaries.length,
    };
  }

  return {
    status: 'success',
    message: `Synced ${data.activities.length} daily records across ${summaries.length} activity types.`,
    activityCount: data.activities.length,
    summaryCount: summaries.length,
  };
}
