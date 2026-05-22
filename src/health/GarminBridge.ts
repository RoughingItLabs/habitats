/**
 * GarminBridge.ts
 * Garmin Connect API integration.
 */
import { DailyActivity } from '../types/activity';

export async function initiateGarminOAuth(): Promise<void> {
  // TODO: Garmin OAuth 1.0a flow
  console.log('[Garmin] OAuth flow — implement');
}

export async function fetchGarminActivities(
  _accessToken: string,
  _startDate: Date,
  _endDate: Date
): Promise<DailyActivity[]> {
  // TODO: Fetch Garmin Connect daily summaries
  return [];
}
