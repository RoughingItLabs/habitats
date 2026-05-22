/**
 * HealthNormalizer.ts
 * All health sources → ActivityData type.
 * Single normalization point — keeps all bridges consistent.
 */
import { DailyActivity, ActivitySummary, ActivityType } from '../types/activity';
import { calculateActivityLevel } from '../engine/ZoneEngine';
import { GOAL_REFERENCES } from '../constants/zones';

export function computeActivitySummaries(
  activities: DailyActivity[],
  today: Date
): ActivitySummary[] {
  const activityTypes: ActivityType[] = [
    'steps', 'sleep', 'running', 'swimming', 'strength',
    'cycling', 'mindfulness', 'hydration', 'nutrition',
  ];

  return activityTypes.map(type => {
    const level = calculateActivityLevel(activities, type, today);

    // Get most recent value for display
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
  const currentLevel = calculateActivityLevel(activities, type, today);

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const pastLevel = calculateActivityLevel(activities, type, weekAgo);

  const delta = currentLevel - pastLevel;
  if (delta > 0.05) return 'rising';
  if (delta < -0.05) return 'falling';
  return 'stable';
}
