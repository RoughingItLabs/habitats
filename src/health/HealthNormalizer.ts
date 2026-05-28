/**
 * HealthNormalizer.ts
 * Single normalization point — all health sources produce DailyActivity rows here.
 */
import {
  DailyActivity,
  ActivitySummary,
  ActivityType,
} from '../types/activity';
import { calculateActivityLevel } from '../engine/ZoneEngine';

export type { DailyActivity };

export interface NormalizedHealthData {
  fetchedAt: Date;
  source: string;
  activities: DailyActivity[];
}

const ALL_ACTIVITY_TYPES: ActivityType[] = [
  'steps',
  'sleep',
  'running',
  'swimming',
  'strength',
  'cycling',
  'mindfulness',
  'hydration',
  'nutrition',
];

export function normalizeToActivitySummaries(
  activities: DailyActivity[],
  today: Date
): ActivitySummary[] {
  return ALL_ACTIVITY_TYPES.filter(type =>
    activities.some(a => a.type === type)
  ).map(type => {
    const level = calculateActivityLevel(activities, type, today);

    const recent = activities
      .filter(a => a.type === type)
      .sort((a, b) => b.date.localeCompare(a.date))[0];

    const recentValue = recent
      ? formatActivityValue(recent.value, recent.unit, type)
      : '—';

    const source = recent?.source ?? null;
    const trend = calculateTrend(activities, type, today);

    return { type, level, recentValue, source, trend };
  });
}

/** @deprecated Use normalizeToActivitySummaries */
export const computeActivitySummaries = normalizeToActivitySummaries;

function formatActivityValue(
  value: number,
  unit: string,
  type: ActivityType
): string {
  if (type === 'steps') return `${Math.round(value).toLocaleString()} steps`;
  if (type === 'sleep') return `${(value / 60).toFixed(1)}h`;
  if (unit === 'm') return `${(value / 1000).toFixed(1)} km`;
  return `${Math.round(value)} ${unit}`;
}

function calculateTrend(
  activities: DailyActivity[],
  type: ActivityType,
  today: Date
): 'rising' | 'stable' | 'falling' {
  const recentSum = sumActivityForDayRange(activities, type, today, 0, 6);
  const priorSum = sumActivityForDayRange(activities, type, today, 7, 13);

  if (priorSum === 0 && recentSum === 0) return 'stable';
  if (priorSum === 0) return 'rising';

  const ratio = recentSum / priorSum;
  if (ratio > 1.1) return 'rising';
  if (ratio < 0.9) return 'falling';
  return 'stable';
}

function sumActivityForDayRange(
  activities: DailyActivity[],
  type: ActivityType,
  today: Date,
  startDaysAgo: number,
  endDaysAgo: number
): number {
  let sum = 0;
  for (let daysAgo = startDaysAgo; daysAgo <= endDaysAgo; daysAgo++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const dateStr = toDateString(date);
    sum += activities
      .filter(a => a.type === type && a.date === dateStr)
      .reduce((total, a) => total + a.value, 0);
  }
  return sum;
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0] as string;
}
