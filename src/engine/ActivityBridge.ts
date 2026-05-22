/**
 * ActivityBridge.ts
 * Normalizes health data from all sources into DailyActivity[].
 * Single source of truth before data reaches ZoneEngine.
 */
import { DailyActivity, ActivityType } from '../types/activity';

export interface RawHealthEntry {
  date: string;
  type: string;
  value: number;
  unit: string;
  source: 'healthkit' | 'healthconnect' | 'strava' | 'garmin' | 'manual';
}

/** Merge and deduplicate entries from multiple sources */
export function normalizeActivities(raw: RawHealthEntry[]): DailyActivity[] {
  const seen = new Set<string>();
  const result: DailyActivity[] = [];

  for (const entry of raw) {
    const key = `${entry.date}:${entry.type}:${entry.source}`;
    if (seen.has(key)) continue;
    seen.add(key);

    if (isValidActivityType(entry.type)) {
      result.push({
        date: entry.date,
        type: entry.type as ActivityType,
        value: entry.value,
        unit: entry.unit,
        source: entry.source,
      });
    }
  }

  return result;
}

function isValidActivityType(type: string): type is ActivityType {
  const valid: ActivityType[] = [
    'steps', 'sleep', 'running', 'swimming', 'strength',
    'cycling', 'mindfulness', 'hydration', 'nutrition',
  ];
  return valid.includes(type as ActivityType);
}
