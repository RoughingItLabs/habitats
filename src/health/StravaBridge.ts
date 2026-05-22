/**
 * StravaBridge.ts
 * Strava OAuth + activity API.
 */
import { DailyActivity } from '../types/activity';

const STRAVA_AUTH_URL = 'https://www.strava.com/oauth/authorize';
const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';
const STRAVA_ACTIVITIES_URL = 'https://www.strava.com/api/v3/athlete/activities';

export async function initiateStravaOAuth(): Promise<void> {
  // TODO: Use expo-auth-session for OAuth flow
  console.log('[Strava] OAuth flow — implement with expo-auth-session');
}

export async function fetchStravaActivities(
  _accessToken: string,
  _startDate: Date,
  _endDate: Date
): Promise<DailyActivity[]> {
  // TODO: Fetch and normalize Strava activities
  console.log('[Strava] Activity fetch — implement API calls');
  return [];
}
