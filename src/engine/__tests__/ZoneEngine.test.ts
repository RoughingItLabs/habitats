import type { DailyActivity, ActivityType } from '../../types/activity';
import { GOAL_REFERENCES } from '../../constants/zones';
import {
  calculateActivityLevel,
  calculateIslandScale,
  isZoneNeglected,
  levelToZoneState,
} from '../ZoneEngine';

const TODAY = new Date('2024-11-15T12:00:00.000Z');

/** Mirror ZoneEngine date bucketing so mock rows align with the algorithm. */
function dateForDaysAgo(today: Date, daysAgo: number): string {
  const date = new Date(today);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0]!;
}

function makeSteps(
  today: Date,
  daysAgo: number,
  value: number,
  overrides: Partial<DailyActivity> = {}
): DailyActivity {
  return {
    date: dateForDaysAgo(today, daysAgo),
    type: 'steps',
    value,
    unit: 'count',
    source: 'manual',
    ...overrides,
  };
}

function fillDays(
  today: Date,
  type: ActivityType,
  days: { daysAgo: number; value: number }[]
): DailyActivity[] {
  const unit =
    type === 'steps'
      ? 'count'
      : type === 'sleep'
        ? 'min'
        : type === 'mindfulness'
          ? 'min'
          : 'count';
  return days.map(({ daysAgo, value }) => ({
    date: dateForDaysAgo(today, daysAgo),
    type,
    value,
    unit,
    source: 'manual',
  }));
}

describe('calculateActivityLevel', () => {
  it('returns 0 with zero activity across 14 days', () => {
    expect(calculateActivityLevel([], 'steps', TODAY)).toBe(0);
  });

  it('returns 1.0 with perfect daily goal for all 14 days', () => {
    const activities = Array.from({ length: 14 }, (_, daysAgo) =>
      makeSteps(TODAY, daysAgo, GOAL_REFERENCES.steps)
    );
    expect(calculateActivityLevel(activities, 'steps', TODAY)).toBe(1);
  });

  it('weights recent days higher than older days (partial week)', () => {
    const recentOnly = fillDays(TODAY, 'steps', [
      { daysAgo: 0, value: GOAL_REFERENCES.steps },
      { daysAgo: 1, value: GOAL_REFERENCES.steps },
      { daysAgo: 2, value: GOAL_REFERENCES.steps },
    ]);
    const olderOnly = fillDays(TODAY, 'steps', [
      { daysAgo: 11, value: GOAL_REFERENCES.steps },
      { daysAgo: 12, value: GOAL_REFERENCES.steps },
      { daysAgo: 13, value: GOAL_REFERENCES.steps },
    ]);

    const recentLevel = calculateActivityLevel(recentOnly, 'steps', TODAY);
    const olderLevel = calculateActivityLevel(olderOnly, 'steps', TODAY);

    expect(recentLevel).toBeGreaterThan(olderLevel);
    // days 0–2 weights: 2 + 2 + 1.5 = 5.5; days 11–13: 0.5 + 0.25 + 0.25 = 1.0
    expect(recentLevel).toBeCloseTo(5.5 / 13, 5);
    expect(olderLevel).toBeCloseTo(1 / 13, 5);
  });

  it('caps level at 1.0 even when daily values exceed goal (1.2 day ratio)', () => {
    const activities = Array.from({ length: 14 }, (_, daysAgo) =>
      makeSteps(TODAY, daysAgo, GOAL_REFERENCES.steps * 2)
    );
    expect(calculateActivityLevel(activities, 'steps', TODAY)).toBe(1);
  });

  it('sums multiple entries on the same day', () => {
    const date = dateForDaysAgo(TODAY, 0);
    const activities: DailyActivity[] = [
      { date, type: 'steps', value: 3500, unit: 'count', source: 'healthkit' },
      { date, type: 'steps', value: 3500, unit: 'count', source: 'strava' },
    ];
    expect(calculateActivityLevel(activities, 'steps', TODAY)).toBeCloseTo(
      2 / 13,
      5
    );
  });

  it('ignores other activity types', () => {
    const activities = [
      makeSteps(TODAY, 0, GOAL_REFERENCES.steps),
      ...fillDays(TODAY, 'sleep', [
        { daysAgo: 0, value: GOAL_REFERENCES.sleep },
        { daysAgo: 1, value: GOAL_REFERENCES.sleep },
      ]),
    ];
    expect(calculateActivityLevel(activities, 'steps', TODAY)).toBeCloseTo(
      2 / 13,
      5
    );
  });
});

describe('levelToZoneState', () => {
  const boundaries: [number, ReturnType<typeof levelToZoneState>][] = [
    [0, 'absent'],
    [0.029, 'absent'],
    [0.03, 'shimmer'],
    [0.119, 'shimmer'],
    [0.12, 'seedling'],
    [0.349, 'seedling'],
    [0.35, 'growing'],
    [0.699, 'growing'],
    [0.7, 'established'],
    [0.899, 'established'],
    [0.9, 'thriving'],
    [1, 'thriving'],
  ];

  it.each(boundaries)('maps level %s to %s', (level, state) => {
    expect(levelToZoneState(level)).toBe(state);
  });
});

describe('isZoneNeglected', () => {
  it('is false with no historical activity beyond 28 days', () => {
    const activities = fillDays(TODAY, 'steps', [
      { daysAgo: 0, value: 0 },
      { daysAgo: 5, value: 100 },
    ]);
    expect(isZoneNeglected(activities, 'steps', TODAY)).toBe(false);
  });

  it('is false when history exists but recent level stays at or above 0.08', () => {
    const activities: DailyActivity[] = [
      {
        date: '2024-10-01',
        type: 'steps',
        value: 5000,
        unit: 'count',
        source: 'manual',
      },
      ...Array.from({ length: 14 }, (_, daysAgo) =>
        makeSteps(TODAY, daysAgo, GOAL_REFERENCES.steps)
      ),
    ];
    expect(isZoneNeglected(activities, 'steps', TODAY)).toBe(false);
  });

  it('is true when zone had activity 28+ days ago but recent level is below 0.08', () => {
    const activities: DailyActivity[] = [
      {
        date: '2024-10-01',
        type: 'steps',
        value: 8000,
        unit: 'count',
        source: 'manual',
      },
    ];
    expect(isZoneNeglected(activities, 'steps', TODAY)).toBe(true);
  });

  it('is false for brand-new activity types with no distant history', () => {
    expect(isZoneNeglected([], 'mindfulness', TODAY)).toBe(false);
  });
});

describe('calculateIslandScale', () => {
  it('maps average zone level to island scale (0.75 base + 0.35 * avg)', () => {
    const levels = {
      steps: 1,
      sleep: 1,
      running: 0,
      swimming: 0,
      strength: 0,
      cycling: 0,
      mindfulness: 0,
      hydration: 0,
      nutrition: 0,
    };
    expect(calculateIslandScale(levels)).toBeCloseTo(0.75 + (2 / 9) * 0.35, 5);
  });
});
