/**
 * HealthConnectBridge.ts
 * Android Health Connect integration.
 */
import { DailyActivity } from '../types/activity';

export async function requestHealthConnectPermissions(): Promise<boolean> {
  // TODO: Implement with react-native-health-connect
  console.log('[HealthConnect] Permission request — implement with react-native-health-connect');
  return false;
}

export async function fetchHealthConnectData(
  _startDate: Date,
  _endDate: Date
): Promise<DailyActivity[]> {
  // TODO: Query Steps, Sleep, Exercise sessions
  console.log('[HealthConnect] Data fetch — implement with react-native-health-connect');
  return [];
}
