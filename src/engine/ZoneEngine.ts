/**
 * ZoneEngine.ts
 * Pure functions — no side effects, fully testable.
 * THE CORE ALGORITHM: takes 14 days of activity data, returns 0.0-1.0 level.
 */
import { DailyActivity, ActivityType } from '../types/activity';
import { ZoneData, ZoneState, ZoneId } from '../types/zone';
import { GOAL_REFERENCES, ZONE_DEFINITIONS } from '../constants/zones';

const WEIGHTS = [2.0, 2.0, 1.5, 1.5, 1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.25, 0.25];

/**
 * Takes 14 days of activity data and returns a 0.0–1.0 level.
 * Recent days weighted higher. No streaks — pure cumulative habit signal.
 */
export function calculateActivityLevel(
  activities: DailyActivity[],
  type: ActivityType,
  today: Date
): number {
  const goal = GOAL_REFERENCES[type];
  let weightedSum = 0;
  let totalWeight = 0;

  for (let daysAgo = 0; daysAgo < 14; daysAgo++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString().split('T')[0] as string;

    const dayActivities = activities.filter(
      a => a.type === type && a.date === dateStr
    );
    const dayTotal = dayActivities.reduce((sum, a) => sum + a.value, 0);
    const dayRatio = Math.min(dayTotal / goal, 1.2); // Allow slight over-achievement

    const weight = WEIGHTS[daysAgo] ?? 0.25;
    weightedSum += dayRatio * weight;
    totalWeight += weight;
  }

  const raw = totalWeight > 0 ? weightedSum / totalWeight : 0;
  return Math.min(Math.max(raw, 0), 1);
}

export function levelToZoneState(level: number): ZoneState {
  if (level < 0.03) return 'absent';
  if (level < 0.12) return 'shimmer';
  if (level < 0.35) return 'seedling';
  if (level < 0.70) return 'growing';
  if (level < 0.90) return 'established';
  return 'thriving';
}

export function isZoneNeglected(
  activities: DailyActivity[],
  type: ActivityType,
  today: Date
): boolean {
  const recentLevel = calculateActivityLevel(activities, type, today);
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 28);
  const olderActivities = activities.filter(
    a => a.type === type && new Date(a.date) < twoWeeksAgo
  );
  const hadHistory = olderActivities.length > 0;
  return hadHistory && recentLevel < 0.08;
}

export function calculateIslandScale(
  zoneLevels: Record<ActivityType, number>
): number {
  const values = Object.values(zoneLevels);
  const avg = values.reduce((s, v) => s + v, 0) / values.length;
  return 0.75 + avg * 0.35;
}

/**
 * Build a complete ZoneData record for all zones from raw activity data.
 */
export function buildAllZoneData(
  activities: DailyActivity[],
  today: Date,
  existingZones?: Partial<Record<ZoneId, ZoneData>>
): Record<ZoneId, ZoneData> {
  const result = {} as Record<ZoneId, ZoneData>;

  for (const [id, def] of Object.entries(ZONE_DEFINITIONS)) {
    const zoneId = id as ZoneId;
    const level = calculateActivityLevel(activities, def.activityType, today);
    const existing = existingZones?.[zoneId];
    const peakLevelEver = Math.max(level, existing?.peakLevelEver ?? 0);

    result[zoneId] = {
      id: zoneId,
      activityType: def.activityType,
      level,
      state: levelToZoneState(level),
      lastUpdated: today,
      peakLevelEver,
      isNeglected: isZoneNeglected(activities, def.activityType, today),
    };
  }

  return result;
}
