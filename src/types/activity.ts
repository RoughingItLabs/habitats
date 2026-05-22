export type ActivityType =
  | 'steps'
  | 'sleep'
  | 'running'
  | 'swimming'
  | 'strength'
  | 'cycling'
  | 'mindfulness'
  | 'hydration'
  | 'nutrition';

export interface DailyActivity {
  date: string;        // ISO date "2024-11-15"
  type: ActivityType;
  value: number;       // Steps, meters, minutes, etc.
  unit: string;
  source: string;      // "healthkit" | "strava" | "manual"
}

export interface ActivitySummary {
  type: ActivityType;
  level: number;       // 0.0 – 1.0 — the key number everything else uses
  recentValue: string; // Human readable "8,432 steps"
  source: string | null;
  trend: 'rising' | 'stable' | 'falling';
}
