# 🏝️ HABITATS — CURSOR PROJECT BRIEF
## Full Dev Handoff Document for AI-Assisted Development

---

## WHAT YOU'RE BUILDING

A React Native + Expo mobile app (iOS + Android simultaneously) where a user's real fitness and wellness habits grow a living island world populated by cute creatures. The island is a mirror of their health — not a judge. No streaks, no failure states, no paywalled wellness features.

**Elevator pitch:** "What if your health habits grew a Ghibli island instead of a step counter?"

---

## TECH STACK — EXACT VERSIONS

```
Framework:        React Native 0.74+ with Expo SDK 51
Language:         TypeScript (strict mode)
Island Renderer:  @shopify/react-native-skia ^1.3.0
Animations:       react-native-reanimated ^3.12.0
Navigation:       expo-router ^3.5.0 (file-based routing)
State:            zustand ^4.5.0
Backend:          Supabase JS ^2.43.0
Health (iOS):     react-native-health (HealthKit wrapper)
Health (Android): react-native-google-fit OR Health Connect API
Payments:         react-native-purchases (RevenueCat) ^7.0.0
Analytics:        posthog-react-native ^3.0.0
Icons:            @expo/vector-icons
Fonts:            expo-font (Quicksand, Nunito from Google Fonts)
SVG:              react-native-svg ^15.2.0
Storage:          @react-native-async-storage/async-storage ^2.0.0
Notifications:    expo-notifications ^0.28.0
```

---

## PROJECT STRUCTURE

```
habitats/
├── app/                          # expo-router screens
│   ├── (tabs)/
│   │   ├── island.tsx            # Main island view — PRIMARY SCREEN
│   │   └── today.tsx             # Daily activity summary
│   ├── onboarding/
│   │   ├── welcome.tsx
│   │   ├── permissions.tsx
│   │   └── first-island.tsx
│   └── _layout.tsx
├── src/
│   ├── engine/                   # ISLAND BRAIN — pure logic, no UI
│   │   ├── ZoneEngine.ts         # Calculates zone levels from activity data
│   │   ├── CreatureEngine.ts     # Creature stage, wandering AI, egg logic
│   │   ├── MagicalMomentEngine.ts# Detects and queues magical moments
│   │   └── ActivityBridge.ts     # Normalizes health data from all sources
│   ├── island/                   # SKIA RENDERING
│   │   ├── IslandCanvas.tsx      # Root Skia canvas — renders everything
│   │   ├── IslandBase.tsx        # The floating landmass shape
│   │   ├── zones/
│   │   │   ├── ZoneRenderer.tsx  # Renders a single zone at a given level
│   │   │   ├── MoonGrove.tsx     # Zone-specific detail art
│   │   │   ├── SunlitMeadow.tsx
│   │   │   ├── EmberTrail.tsx
│   │   │   ├── TidalLagoon.tsx
│   │   │   ├── ZenClearing.tsx
│   │   │   └── StonePeak.tsx
│   │   ├── creatures/
│   │   │   ├── CreatureSprite.tsx    # Base wandering creature component
│   │   │   ├── WanderBehavior.ts     # Wandering AI hook
│   │   │   └── sprites/
│   │   │       ├── MoonFox.tsx       # SVG sprite, 5 stages
│   │   │       ├── EmberWolf.tsx
│   │   │       ├── MeadowBunny.tsx
│   │   │       ├── ForestDeer.tsx
│   │   │       └── TideOtter.tsx
│   │   ├── effects/
│   │   │   ├── ParticleSystem.tsx    # Reusable particles (sparkles, embers)
│   │   │   ├── WeatherLayer.tsx      # Rain, golden light, aurora
│   │   │   └── NightMode.tsx         # Moon overlay after midnight
│   │   └── BeachEgg.tsx              # Glowing egg on shoreline
│   ├── health/
│   │   ├── HealthKitBridge.ts        # iOS HealthKit integration
│   │   ├── HealthConnectBridge.ts    # Android Health Connect
│   │   ├── StravaBridge.ts           # Strava OAuth + API
│   │   ├── GarminBridge.ts           # Garmin Connect API
│   │   └── HealthNormalizer.ts       # All sources → ActivityData type
│   ├── store/
│   │   ├── islandStore.ts            # Zustand — island + zone state
│   │   ├── creatureStore.ts          # Zustand — creatures, eggs, collection
│   │   ├── healthStore.ts            # Zustand — raw + normalized health data
│   │   └── economyStore.ts           # Zustand — Moss Coins, season pass
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── types.ts                  # Generated from Supabase schema
│   │   └── sync.ts                   # Local → cloud sync logic
│   ├── types/
│   │   ├── activity.ts
│   │   ├── zone.ts
│   │   ├── creature.ts
│   │   └── island.ts
│   └── constants/
│       ├── zones.ts                  # Zone definitions, colors, thresholds
│       ├── creatures.ts              # Creature roster, stage definitions
│       └── activities.ts            # Activity → zone mappings
├── assets/
│   ├── fonts/
│   ├── creatures/                    # SVG art files
│   └── zones/                        # Zone background art
└── supabase/
    ├── schema.sql
    └── migrations/
```

---

## CORE DATA TYPES

```typescript
// src/types/activity.ts

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
  date: string;           // ISO date "2024-11-15"
  type: ActivityType;
  value: number;          // Steps, meters, minutes, etc.
  unit: string;
  source: string;         // "healthkit" | "strava" | "manual"
}

export interface ActivitySummary {
  type: ActivityType;
  level: number;          // 0.0 – 1.0 — the key number everything else uses
  recentValue: string;    // Human readable "8,432 steps"
  source: string | null;
  trend: 'rising' | 'stable' | 'falling';
}
```

```typescript
// src/types/zone.ts

export type ZoneId =
  | 'meadow'
  | 'moongrove'
  | 'embertrail'
  | 'tidallagoon'
  | 'zenclearing'
  | 'stonepeak'
  | 'crystalsprings'
  | 'harvestglen'
  | 'windspire';

export type ZoneState =
  | 'absent'      // level < 0.03
  | 'shimmer'     // 0.03 – 0.12
  | 'seedling'    // 0.12 – 0.35
  | 'growing'     // 0.35 – 0.70
  | 'established' // 0.70 – 0.90
  | 'thriving';   // 0.90 – 1.0

export interface ZoneData {
  id: ZoneId;
  activityType: ActivityType;
  level: number;           // 0.0 – 1.0
  state: ZoneState;
  lastUpdated: Date;
  peakLevelEver: number;   // Never shrink below this visually
  isNeglected: boolean;    // > 14 days of declining activity
}

export interface ZoneDefinition {
  id: ZoneId;
  name: string;
  activityType: ActivityType;
  colors: {
    primary: string;
    mid: string;
    light: string;
    glow: string;
  };
  basePosition: { x: number; y: number };  // % of viewBox
  baseSize: { w: number; h: number };
  goalReference: number;   // Soft reference value for level=1.0 calc
  goalUnit: string;
}
```

```typescript
// src/types/creature.ts

export type CreatureSpecies =
  | 'moon_fox'
  | 'dream_sprite'
  | 'ember_wolf'
  | 'fire_hare'
  | 'meadow_bunny'
  | 'forest_deer'
  | 'tide_otter'
  | 'cloud_sprite'
  | 'rock_sprite';

export type CreatureStage = 1 | 2 | 3 | 4 | 5;
// 1=Hatchling, 2=Sprout, 3=Young, 4=Adult, 5=Legendary

export interface Creature {
  id: string;
  species: CreatureSpecies;
  name: string;            // User-set or auto-generated
  stage: CreatureStage;
  zoneId: ZoneId;
  xpProgress: number;      // 0.0 – 1.0 toward next stage
  isLegendary: boolean;
  hasGraduated: boolean;   // Moved to collection
  discoveredAt: Date;
}

export interface Egg {
  id: string;
  species: CreatureSpecies;
  zoneId: ZoneId;
  progress: number;        // 0.0 – 1.0 toward hatching
  discoveredAt: Date;
  beachPosition: { x: number; y: number };
}
```

---

## THE ZONE ENGINE — MOST IMPORTANT FILE

```typescript
// src/engine/ZoneEngine.ts
// Pure functions — no side effects, fully testable

import { DailyActivity, ActivitySummary, ActivityType } from '../types/activity';
import { ZoneData, ZoneState, ZoneId } from '../types/zone';
import { ZONE_DEFINITIONS, GOAL_REFERENCES } from '../constants/zones';

/**
 * THE CORE ALGORITHM
 * Takes 14 days of activity data, returns a 0.0-1.0 level per activity type.
 * Recent days weighted higher. No streaks — pure cumulative habit signal.
 */
export function calculateActivityLevel(
  activities: DailyActivity[],
  type: ActivityType,
  today: Date
): number {
  const WEIGHTS = [2.0, 2.0, 1.5, 1.5, 1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.25, 0.25];
  const goal = GOAL_REFERENCES[type];

  let weightedSum = 0;
  let totalWeight = 0;

  for (let daysAgo = 0; daysAgo < 14; daysAgo++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString().split('T')[0];

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
  // Zone is "neglected" if it had activity before but hasn't for 14+ days
  const recentLevel = calculateActivityLevel(activities, type, today);
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 28);
  const olderActivities = activities.filter(
    a => a.type === type && new Date(a.date) < twoWeeksAgo
  );
  const hadHistory = olderActivities.length > 0;
  return hadHistory && recentLevel < 0.08;
}

export function calculateIslandScale(zoneLevels: Record<ActivityType, number>): number {
  const avg = Object.values(zoneLevels).reduce((s, v) => s + v, 0) /
              Object.values(zoneLevels).length;
  return 0.75 + avg * 0.35;
}
```

---

## ZONE CONSTANTS

```typescript
// src/constants/zones.ts

import { ZoneDefinition, ZoneId } from '../types/zone';
import { ActivityType } from '../types/activity';

export const GOAL_REFERENCES: Record<ActivityType, number> = {
  steps:       7000,   // steps/day
  sleep:       480,    // minutes/day (8 hours)
  running:     15000,  // meters/week → ~2143/day
  swimming:    2000,   // meters/week → ~286/day
  strength:    2,      // sessions/week → ~0.29/day
  cycling:     30000,  // meters/week → ~4286/day
  mindfulness: 10,     // minutes/day
  hydration:   8,      // cups/day
  nutrition:   1,      // logged day = 1, not logged = 0
};

export const ZONE_DEFINITIONS: Record<ZoneId, ZoneDefinition> = {
  moongrove: {
    id: 'moongrove',
    name: 'Moon Grove',
    activityType: 'sleep',
    colors: {
      primary: '#4A3A7A',
      mid: '#7A6AAA',
      light: '#C4B5D9',
      glow: '#E8D8FF',
    },
    basePosition: { x: 12, y: 30 },
    baseSize: { w: 28, h: 26 },
    goalReference: 480,
    goalUnit: 'minutes',
  },
  meadow: {
    id: 'meadow',
    name: 'Sunlit Meadow',
    activityType: 'steps',
    colors: {
      primary: '#4A7A50',
      mid: '#6AAA70',
      light: '#A8D890',
      glow: '#D4F0B8',
    },
    basePosition: { x: 36, y: 44 },
    baseSize: { w: 30, h: 22 },
    goalReference: 7000,
    goalUnit: 'steps',
  },
  embertrail: {
    id: 'embertrail',
    name: 'Ember Trail',
    activityType: 'running',
    colors: {
      primary: '#8A3A10',
      mid: '#C46020',
      light: '#F5C9A0',
      glow: '#FFE8C0',
    },
    basePosition: { x: 58, y: 28 },
    baseSize: { w: 26, h: 24 },
    goalReference: 2143,
    goalUnit: 'meters',
  },
  tidallagoon: {
    id: 'tidallagoon',
    name: 'Tidal Lagoon',
    activityType: 'swimming',
    colors: {
      primary: '#1A5A7A',
      mid: '#2A7A9A',
      light: '#A8D4E6',
      glow: '#C8F0FF',
    },
    basePosition: { x: 26, y: 64 },
    baseSize: { w: 24, h: 18 },
    goalReference: 286,
    goalUnit: 'meters',
  },
  zenclearing: {
    id: 'zenclearing',
    name: 'Zen Clearing',
    activityType: 'mindfulness',
    colors: {
      primary: '#3A6A5A',
      mid: '#5A9A7A',
      light: '#A8D4C0',
      glow: '#C8EEE0',
    },
    basePosition: { x: 60, y: 57 },
    baseSize: { w: 20, h: 17 },
    goalReference: 10,
    goalUnit: 'minutes',
  },
  stonepeak: {
    id: 'stonepeak',
    name: 'Stone Peak',
    activityType: 'strength',
    colors: {
      primary: '#5A5040',
      mid: '#8A7A6A',
      light: '#C4B4A4',
      glow: '#E4D8C8',
    },
    basePosition: { x: 58, y: 44 },
    baseSize: { w: 18, h: 16 },
    goalReference: 0.29,
    goalUnit: 'sessions',
  },
  crystalsprings: {
    id: 'crystalsprings',
    name: 'Crystal Springs',
    activityType: 'hydration',
    colors: {
      primary: '#2A6A8A',
      mid: '#4A9ABA',
      light: '#A8D8F0',
      glow: '#C8F0FF',
    },
    basePosition: { x: 20, y: 50 },
    baseSize: { w: 18, h: 15 },
    goalReference: 8,
    goalUnit: 'cups',
  },
  harvestglen: {
    id: 'harvestglen',
    name: 'Harvest Glen',
    activityType: 'nutrition',
    colors: {
      primary: '#6A5A20',
      mid: '#9A8A40',
      light: '#D4C480',
      glow: '#F0E0A0',
    },
    basePosition: { x: 44, y: 62 },
    baseSize: { w: 18, h: 14 },
    goalReference: 1,
    goalUnit: 'logged day',
  },
  windspire: {
    id: 'windspire',
    name: 'Wind Spire',
    activityType: 'cycling',
    colors: {
      primary: '#2A4A6A',
      mid: '#4A7AAA',
      light: '#A8C8E8',
      glow: '#C8E8FF',
    },
    basePosition: { x: 70, y: 42 },
    baseSize: { w: 16, h: 14 },
    goalReference: 4286,
    goalUnit: 'meters',
  },
};
```

---

## ZUSTAND STORES

```typescript
// src/store/islandStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ZoneData, ZoneId } from '../types/zone';
import { ActivitySummary } from '../types/activity';

interface IslandStore {
  zones: Record<ZoneId, ZoneData>;
  islandScale: number;
  lastSynced: Date | null;

  // Actions
  updateZones: (activities: ActivitySummary[]) => void;
  setIslandScale: (scale: number) => void;
}

export const useIslandStore = create<IslandStore>()(
  persist(
    (set, get) => ({
      zones: {} as Record<ZoneId, ZoneData>,
      islandScale: 0.75,
      lastSynced: null,

      updateZones: (activities) => {
        // Called by ZoneEngine after health data sync
        // Smoothly transitions zone levels
      },

      setIslandScale: (scale) => set({ islandScale: scale }),
    }),
    { name: 'island-storage' }
  )
);
```

---

## SUPABASE SCHEMA

```sql
-- supabase/schema.sql

-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users primary key,
  display_name text,
  created_at timestamptz default now(),
  moss_coins integer default 0,
  season_pass_active boolean default false
);

-- Island state per user
create table public.island_state (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles not null,
  zone_id text not null,
  level float not null default 0,
  peak_level float not null default 0,
  is_neglected boolean default false,
  last_updated timestamptz default now(),
  unique(user_id, zone_id)
);

-- Creatures
create table public.creatures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles not null,
  species text not null,
  name text,
  stage integer default 1,
  zone_id text not null,
  xp_progress float default 0,
  has_graduated boolean default false,
  discovered_at timestamptz default now()
);

-- Eggs
create table public.eggs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles not null,
  species text not null,
  zone_id text not null,
  progress float default 0,
  discovered_at timestamptz default now(),
  hatched_at timestamptz
);

-- Activity cache (last 30 days, synced from health APIs)
create table public.activity_cache (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles not null,
  date date not null,
  activity_type text not null,
  value float not null,
  unit text not null,
  source text not null,
  unique(user_id, date, activity_type, source)
);

-- Moss coin transactions
create table public.coin_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles not null,
  amount integer not null,  -- positive = earn, negative = spend
  reason text not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.island_state enable row level security;
alter table public.creatures enable row level security;
alter table public.eggs enable row level security;
alter table public.activity_cache enable row level security;
alter table public.coin_transactions enable row level security;

create policy "Users own their data" on public.profiles
  for all using (auth.uid() = id);
create policy "Users own their island" on public.island_state
  for all using (auth.uid() = user_id);
create policy "Users own their creatures" on public.creatures
  for all using (auth.uid() = user_id);
create policy "Users own their eggs" on public.eggs
  for all using (auth.uid() = user_id);
create policy "Users own their activity" on public.activity_cache
  for all using (auth.uid() = user_id);
create policy "Users own their coins" on public.coin_transactions
  for all using (auth.uid() = user_id);
```

---

## ENVIRONMENT VARIABLES

```bash
# .env.local
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_POSTHOG_KEY=your_posthog_key
STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_client_secret
GARMIN_CLIENT_ID=your_garmin_client_id
GARMIN_CLIENT_SECRET=your_garmin_client_secret
REVENUECAT_IOS_KEY=your_revenuecat_ios_key
REVENUECAT_ANDROID_KEY=your_revenuecat_android_key
```

---

## CURSOR PROMPTS TO START WITH

Paste these into Cursor one at a time in this order:

### Prompt 1 — Project Setup
```
Set up a new Expo 51 project with TypeScript strict mode. Install and configure:
- @shopify/react-native-skia
- react-native-reanimated 3
- zustand with persist middleware
- expo-router
- @supabase/supabase-js
- react-native-svg

Create the full folder structure as defined in the project brief. Create placeholder
index files for each module. Set up the app.json with bundle IDs
com.habitats.app for both iOS and Android.
```

### Prompt 2 — Zone Engine
```
Implement src/engine/ZoneEngine.ts exactly as specified. Write Jest unit tests for:
- calculateActivityLevel with 14 days of mock data
- Edge cases: zero activity, perfect activity, partial weeks
- levelToZoneState boundaries
- isZoneNeglected detection
All functions must be pure — no side effects, no imports from React or React Native.
```

### Prompt 3 — Island Canvas
```
Build the IslandCanvas component using @shopify/react-native-skia.
The canvas should:
- Render a floating island base as a layered ellipse (beach ring + land mass + highland)
- Accept an array of ZoneData and render each zone using ZoneRenderer
- Island scale is driven by islandScale prop (0.75 – 1.1)
- All coordinates use a 0-100 viewBox normalized to screen size
- Smooth animated transitions when zone levels change using Reanimated shared values
Start with the island base only — no zones or creatures yet.
```

### Prompt 4 — Moon Grove Zone
```
Implement the MoonGrove zone renderer as a Skia component.
At level 0.03-0.12: render only a soft purple glow ellipse with animated opacity pulse
At level 0.12-0.35: add the base terrain ellipse, muted colors
At level 0.35-0.70: add stylized tree shapes (circle + line), mid-color details
At level 0.70+: add inner light ellipse, glowing particles, full lush color
At neglected state: desaturate colors by 40%, add a slight grey-green tint
All transitions must animate smoothly over 2000ms when level changes.
Zone colors: primary #4A3A7A, mid #7A6AAA, light #C4B5D9, glow #E8D8FF
```

### Prompt 5 — Creature Wandering
```
Build the CreatureSprite component and WanderBehavior hook.
WanderBehavior should:
- Pick a random target within zone bounds every 2500-5000ms
- Smoothly interpolate current position toward target using Reanimated
- Flip sprite horizontally when moving left
- Add a gentle vertical bob (sin wave, amplitude 1.5px)
- Slow wander speed when zone is neglected (0.3x normal speed)
- Pause occasionally (15% chance to idle for 1-3 seconds)
CreatureSprite renders the appropriate SVG sprite scaled by stage (0.55x to 1.25x)
with a soft drop shadow ellipse beneath it.
```

---

## HEALTHKIT INTEGRATION (iOS)

```typescript
// src/health/HealthKitBridge.ts — key queries to implement

const HEALTHKIT_QUERIES = {
  steps: {
    type: 'HKQuantityTypeIdentifierStepCount',
    unit: 'count',
    aggregation: 'sum',
  },
  sleep: {
    type: 'HKCategoryTypeIdentifierSleepAnalysis',
    unit: 'min',
    aggregation: 'sum',
    filter: 'asleep', // exclude 'inBed' time
  },
  running: {
    type: 'HKWorkoutActivityTypeRunning',
    unit: 'm',
    aggregation: 'sum',
  },
  swimming: {
    type: 'HKWorkoutActivityTypeSwimming',
    unit: 'm',
    aggregation: 'sum',
  },
  mindfulness: {
    type: 'HKCategoryTypeIdentifierMindfulSession',
    unit: 'min',
    aggregation: 'sum',
  },
};

// Request permissions on first launch — read only, never write
const READ_PERMISSIONS = [
  'Steps', 'SleepAnalysis', 'Workout',
  'MindfulSession', 'ActiveEnergyBurned',
  'DistanceWalkingRunning', 'DistanceCycling',
  'DistanceSwimming', 'DietaryWater',
];
```

---

## KEY DESIGN RULES FOR CURSOR TO FOLLOW

1. **No streak logic anywhere** — the word "streak" should not appear in the codebase
2. **Zone levels never decrease below peakLevelEver** for visual size — only texture/color changes
3. **No push notifications for health data** — only for seasonal events (opt-in)
4. **Health data never sent to analytics** — PostHog events contain no health values
5. **All zone transitions animate** — never jump, always smooth interpolation
6. **Magical moments are discovered, never announced** — no modals, no banners
7. **Island is always visible on app open** — no loading screens if cached state exists
8. **TypeScript strict mode** — no `any` types, full null safety
9. **Offline first** — app works fully without internet using cached health data
10. **Creatures wander at all times** — even if zone is neglected, creatures exist (just slower)

---

## ART ASSETS NEEDED (brief for artist)

Each creature needs **5 SVG files** (one per stage). Style: soft illustrated, cartoony,
large expressive eyes, clean outlines, gentle gradients. Reference: Studio Ghibli x
mobile game. NOT pixel art, NOT 3D rendered.

Priority order:
1. Moon Fox (5 stages) — for Moon Grove
2. Ember Wolf (5 stages) — for Ember Trail  
3. Meadow Bunny (5 stages) — for Sunlit Meadow
4. Forest Deer (5 stages) — for Sunlit Meadow
5. Tide Otter (5 stages) — for Tidal Lagoon

Stage size reference (at base 100px):
- Stage 1 Hatchling: 45px — tiny, wobbly, minimal detail
- Stage 2 Sprout: 65px — growing, simple features
- Stage 3 Young: 82px — defined, personality emerging  
- Stage 4 Adult: 100px — full detail, all features
- Stage 5 Legendary: 115px — crown/aura, special markings, orbiting particles

Zone backgrounds needed (2048x2048px, illustrated):
1. Moon Grove — deep purple night forest, bioluminescent plants, god rays
2. Sunlit Meadow — warm golden grass, wildflowers, dappled light
3. Ember Trail — rust/amber terrain, glowing embers, warm sunset
4. Tidal Lagoon — teal water, sea rocks, soft wave light
5. Zen Clearing — misty green clearing, soft light shafts, floating petals

---

*Habitats — v1.0 Cursor Brief — Confidential*

---

---

# 🤖 AGENT ARCHITECTURE

## Philosophy
Habitats uses AI agents for exactly one purpose: to make the island feel *alive and personal*.
Every agent call is contextual, purposeful, and low-stakes — if it fails, the app falls back
gracefully. No agent is in a critical path. Agents add delight, never block functionality.

**Resume framing:** "Designed and implemented a multi-agent narrative system that reads
biometric context from fitness APIs and generates emotionally appropriate, personalized
island storytelling — including real-time zone narration, weekly wellness reflections,
creature naming, and seasonal lore generation."

---

## Agent Stack

```
LLM Provider:     Anthropic Claude (claude-haiku-4-5 for speed + cost, sonnet for weekly insights)
Agent Framework:  Vercel AI SDK (useChat / generateText / streamText)
Orchestration:    Custom lightweight AgentRunner in src/agents/AgentRunner.ts
Caching:          Supabase — generated content cached, never re-run same context twice
Rate limiting:    1 narration/open, 1 insight/week, 1 name/hatch — never spammy
Fallbacks:        Every agent has a static fallback pool if API is unavailable
```

---

## Agent 1 — Island Narration Agent

**What it does:** Generates a fresh 1-2 sentence observation each time the user opens
the app. Reads the current island state and writes something that feels like the island
has a quiet inner life. Never prescriptive, never clinical, always poetic.

**Trigger:** App foreground event, max once per 4-hour window

**Input context:**
```typescript
interface NarrationContext {
  zones: {
    id: ZoneId;
    state: ZoneState;       // thriving, growing, neglected, shimmer etc.
    level: number;
    isNeglected: boolean;
    creatures: { name: string; species: string; stage: CreatureStage }[];
  }[];
  timeOfDay: 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  recentActivity: {         // last 24h — NO raw health numbers, just qualitative
    type: ActivityType;
    quality: 'strong' | 'gentle' | 'quiet' | 'absent';
  }[];
  hasNewEgg: boolean;
  hasNewLegendary: boolean;
}
```

**System prompt:**
```
You are the quiet narrator of a living island world called Habitats. The island grows
with the user's real health habits. Your job is to write a single brief observation
(1-2 sentences, max 30 words) about what the island feels like right now.

Rules:
- Never mention health metrics, goals, streaks, or numbers
- Never be prescriptive ("you should...") or clinical
- Write as if observing a real living world, not a game
- Tone: warm, slightly magical, like a nature documentary crossed with Studio Ghibli
- Reference specific creature names and zone names when available
- If zones are neglected, be honest but gentle — "quiet" not "failing"
- If something new is happening (egg, legendary), let it shimmer through naturally
- Never use the words: streak, goal, metric, data, health, wellness, app

Good examples:
- "The Moon Grove is unusually still tonight. Lunara has been curled near the old roots."
- "Something golden is moving through the Ember Trail — Vex seems restless today."
- "A new shimmer has appeared at the water's edge. The tide is bringing something."

Bad examples:
- "Your sleep score has improved! Great job hitting your goals."
- "The Moon Grove needs attention — try getting more sleep tonight."
```

**Output:** Single string, 1-2 sentences, displayed as ambient island text

**Implementation:**
```typescript
// src/agents/NarrationAgent.ts

import Anthropic from '@anthropic-ai/sdk';
import { NarrationContext } from '../types/agents';
import { NARRATION_FALLBACKS } from '../constants/agentFallbacks';

const client = new Anthropic();

export async function generateIslandNarration(
  context: NarrationContext
): Promise<string> {
  // Check cache first — same context hash = same narration
  const contextHash = hashNarrationContext(context);
  const cached = await getCachedNarration(contextHash);
  if (cached) return cached;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 80,
      system: NARRATION_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: buildNarrationPrompt(context),
      }],
    });

    const narration = message.content[0].type === 'text'
      ? message.content[0].text.trim()
      : getRandomFallback(context);

    await cacheNarration(contextHash, narration);
    return narration;

  } catch (error) {
    // Graceful fallback — app never breaks
    return getRandomFallback(context);
  }
}

function buildNarrationPrompt(ctx: NarrationContext): string {
  const activeZones = ctx.zones.filter(z => z.state !== 'absent');
  const neglectedZones = ctx.zones.filter(z => z.isNeglected);
  const thrivingZones = ctx.zones.filter(z => z.state === 'thriving');

  return `
Island state: ${ctx.timeOfDay}, ${ctx.season}
Active zones: ${activeZones.map(z =>
  `${z.id} (${z.state}, creatures: ${z.creatures.map(c => c.name).join(', ') || 'none'})`
).join(' | ')}
${neglectedZones.length > 0 ? `Quiet zones: ${neglectedZones.map(z => z.id).join(', ')}` : ''}
${thrivingZones.length > 0 ? `Thriving: ${thrivingZones.map(z => z.id).join(', ')}` : ''}
Recent activity feel: ${ctx.recentActivity.map(a => `${a.type}: ${a.quality}`).join(', ')}
${ctx.hasNewEgg ? 'A new egg has appeared on the beach.' : ''}
${ctx.hasNewLegendary ? 'A creature has just reached legendary stage.' : ''}

Write one observation about this island right now.
  `.trim();
}
```

---

## Agent 2 — Weekly Wellness Reflection Agent

**What it does:** Once a week (Monday morning), generates a short personal reflection
about the user's island over the past 7 days. Notices patterns, celebrates quiet
consistency, acknowledges neglect gently. Feels like a letter from the island itself.

**Trigger:** Monday 8am local time, delivered as a gentle in-app card (never push notification)

**Input context:**
```typescript
interface WeeklyReflectionContext {
  weekSummary: {
    zoneId: ZoneId;
    zoneName: string;
    levelStart: number;       // Level at start of week
    levelEnd: number;         // Level at end of week
    trend: 'rising' | 'stable' | 'falling' | 'new';
    creatureNames: string[];
  }[];
  biggestGrowth: ZoneId | null;     // Zone that grew most
  mostNeglected: ZoneId | null;     // Zone that fell most
  newCreaturesThisWeek: string[];   // Names of newly hatched creatures
  legendariesThisWeek: string[];    // Creatures that reached legendary
  islandAge: number;                // Days since first use
  season: string;
}
```

**System prompt:**
```
You are writing a brief weekly reflection from the perspective of a living island.
Write 3-5 sentences (max 80 words) as if the island is gently observing the past week.

Rules:
- Write in second person ("your island", "you") but from the island's perspective
- Never mention numbers, scores, metrics, or streaks
- Celebrate consistency, not intensity — "gentle and steady" is as valid as "thriving"
- Acknowledge neglected areas with acceptance, never guilt
- Mention specific creature names if provided
- End with one quiet, forward-looking sentence about what the island is ready for
- Tone: like receiving a postcard from a place that knows you well

Good example:
"The Moon Grove has been glowing softly all week — Lunara seems content, spending
long evenings near the water. The Ember Trail has been quieter, though Vex hasn't
wandered far. Your island has been settling into itself. Something patient is waiting
in the eastern shimmer."
```

**Implementation:**
```typescript
// src/agents/WeeklyReflectionAgent.ts

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function generateWeeklyReflection(
  context: WeeklyReflectionContext
): Promise<string> {
  // Only generate once per week — check Supabase for this week's reflection
  const existingReflection = await getThisWeeksReflection(context.userId);
  if (existingReflection) return existingReflection;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',   // Sonnet for richer weekly reflection
      max_tokens: 200,
      system: WEEKLY_REFLECTION_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: buildWeeklyPrompt(context),
      }],
    });

    const reflection = message.content[0].type === 'text'
      ? message.content[0].text.trim()
      : WEEKLY_FALLBACKS[Math.floor(Math.random() * WEEKLY_FALLBACKS.length)];

    // Save to Supabase — this week's reflection is fixed once generated
    await saveWeeklyReflection(context.userId, reflection);
    return reflection;

  } catch {
    return WEEKLY_FALLBACKS[Math.floor(Math.random() * WEEKLY_FALLBACKS.length)];
  }
}
```

---

## Agent 3 — Creature Naming Agent

**What it does:** When an egg hatches, generates a unique name for the new creature
based on the species, the zone it lives in, and the user's dominant activity patterns.
Names feel earned and personal — never random strings.

**Trigger:** Egg hatch event (once per hatch, result cached permanently)

**Input context:**
```typescript
interface CreatureNamingContext {
  species: CreatureSpecies;
  zoneName: string;
  zoneActivity: ActivityType;
  dominantActivities: ActivityType[];   // User's top 2-3 activities
  timeOfHatch: 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';
  season: string;
  existingCreatureNames: string[];      // Avoid duplicates
}
```

**System prompt:**
```
You are naming a newly hatched creature in a magical island world.
Generate exactly ONE name (single word or two short words) for this creature.

Rules:
- The name should feel soft, slightly magical, nature-inspired
- Draw from the creature's species, their zone's atmosphere, and the activity that
  powers their zone — but subtly, not literally (not "Runny" for a running creature)
- Avoid names that are already taken (listed in existing names)
- The name should feel like it fits this specific creature, not generic
- Good names: Lunara, Vex, Ripple, Fern, Cinder, Mist, Briar, Nova, Sable, Drift
- Bad names: Fluffy, Runner, Sleepy, Buddy, anything with numbers

Species context:
- moon_fox → mystical, night-sky, celestial references
- ember_wolf → fire, heat, movement, trails
- meadow_bunny → soft, earthy, gentle, botanical
- forest_deer → quiet, forest, ancient, graceful
- tide_otter → water, coastal, playful, fluid
- cloud_sprite → airy, light, ephemeral, dreamy
- rock_sprite → solid, ancient, grounded, patient

Return ONLY the name, nothing else.
```

**Implementation:**
```typescript
// src/agents/CreatureNamingAgent.ts

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Fallback name pools per species — used if API unavailable
const NAME_POOLS: Record<CreatureSpecies, string[]> = {
  moon_fox:     ['Lunara', 'Nova', 'Sable', 'Dusk', 'Lyra', 'Mira', 'Soleil'],
  ember_wolf:   ['Vex', 'Cinder', 'Ash', 'Blaze', 'Sear', 'Flint', 'Roan'],
  meadow_bunny: ['Clover', 'Fern', 'Pip', 'Briar', 'Moss', 'Wren', 'Sage'],
  forest_deer:  ['Briar', 'Fawn', 'Cedar', 'Elm', 'Reed', 'Birch', 'Hazel'],
  tide_otter:   ['Ripple', 'Drift', 'Kelp', 'Bay', 'Coral', 'Foam', 'Cove'],
  cloud_sprite: ['Mist', 'Cirrus', 'Wisp', 'Haze', 'Aura', 'Zephyr', 'Nimbus'],
  rock_sprite:  ['Slate', 'Flint', 'Gravel', 'Tuff', 'Basalt', 'Cairn', 'Shale'],
};

export async function generateCreatureName(
  context: CreatureNamingContext
): Promise<string> {
  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,     // Name only — tight token limit
      system: NAMING_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `
Species: ${context.species}
Zone: ${context.zoneName} (${context.zoneActivity})
User's most active habits: ${context.dominantActivities.join(', ')}
Time of hatch: ${context.timeOfHatch}, ${context.season}
Names already taken: ${context.existingCreatureNames.join(', ')}

Generate one name.
        `.trim(),
      }],
    });

    const name = message.content[0].type === 'text'
      ? message.content[0].text.trim().split('\n')[0]  // First line only
      : null;

    // Validate — must be 1-2 words, no numbers, not already taken
    if (name && isValidName(name, context.existingCreatureNames)) {
      return name;
    }
    return getFallbackName(context.species, context.existingCreatureNames);

  } catch {
    return getFallbackName(context.species, context.existingCreatureNames);
  }
}

function isValidName(name: string, existing: string[]): boolean {
  const words = name.trim().split(' ');
  return (
    words.length <= 2 &&
    words.every(w => /^[A-Za-z]+$/.test(w)) &&
    !existing.includes(name)
  );
}
```

---

## Agent 4 — Seasonal Lore Agent

**What it does:** Generates flavor text for each new season pass, lore entries when a
creature reaches Legendary, and event descriptions for magical moments. Runs server-side
once per season/event — output is stored in Supabase and served to all users.

**Trigger:** Admin-triggered (new season) or per-user (creature reaches Legendary)

**Two sub-agents:**

### 4a — Season Flavor Writer
```typescript
// Generates season pass intro text, reward descriptions, event lore
// Runs ONCE per season on server, cached for all users

interface SeasonContext {
  seasonName: string;       // "Cherry Blossom", "Northern Lights" etc.
  realWorldSeason: string;
  year: number;
  themeTags: string[];      // ["floral", "renewal", "soft pink", "wind"]
  featuredZone: ZoneId;
  featuredCreature: CreatureSpecies;
}
```

**System prompt:**
```
Write flavor text for a seasonal event in a cozy wellness island game.
Generate three pieces of text:
1. INTRO: 2 sentences introducing the season (max 40 words)
2. TAGLINE: One evocative line for the season pass card (max 12 words)
3. REWARD_DESC: One sentence describing the seasonal cosmetic rewards (max 25 words)

Tone: warm, slightly magical, inviting. Like the opening of a Ghibli film.
Format your response as JSON: { "intro": "...", "tagline": "...", "reward_desc": "..." }
```

### 4b — Legendary Lore Writer
```typescript
// Generates a personal lore entry when a creature reaches Stage 5
// Unique per creature — references their name, zone, and journey

interface LegendaryLoreContext {
  creatureName: string;
  species: CreatureSpecies;
  zoneName: string;
  zoneActivity: ActivityType;
  daysOnIsland: number;
  season: string;
}
```

**System prompt:**
```
Write a short lore entry (3-4 sentences, max 60 words) for a creature that has
just reached Legendary status on a living island. This is their permanent record —
it will live in the user's Collection forever.

Write as if recording the creature's history in a field guide or nature journal.
Reference their name, their home zone, and what made them legendary.
Tone: quiet, reverent, timeless. Like an entry in an ancient bestiary.

Example:
"Lunara arrived in the Moon Grove during the first autumn frost, small enough
to fit in a cupped hand. She grew through seven moons of quiet nights and
restful mornings. Now she moves through the grove like starlight — barely
touching the ground."
```

---

## Agent Orchestration

```typescript
// src/agents/AgentRunner.ts
// Central coordinator — manages all agent calls, rate limiting, caching

import { NarrationAgent } from './NarrationAgent';
import { WeeklyReflectionAgent } from './WeeklyReflectionAgent';
import { CreatureNamingAgent } from './CreatureNamingAgent';
import { SeasonalLoreAgent } from './SeasonalLoreAgent';

export class AgentRunner {
  private static instance: AgentRunner;

  // Singleton — one runner for the whole app
  static getInstance(): AgentRunner {
    if (!AgentRunner.instance) {
      AgentRunner.instance = new AgentRunner();
    }
    return AgentRunner.instance;
  }

  // Called on every app open
  async onAppOpen(islandState: IslandState): Promise<string | null> {
    if (!this.canRunNarration()) return null;    // Rate limit check
    const context = this.buildNarrationContext(islandState);
    return NarrationAgent.generateIslandNarration(context);
  }

  // Called on Monday morning
  async onWeeklyTrigger(userId: string): Promise<string | null> {
    if (!this.isNewWeek(userId)) return null;
    const context = await this.buildWeeklyContext(userId);
    return WeeklyReflectionAgent.generateWeeklyReflection(context);
  }

  // Called when egg hatches
  async onEggHatch(egg: Egg, islandState: IslandState): Promise<string> {
    const context = this.buildNamingContext(egg, islandState);
    return CreatureNamingAgent.generateCreatureName(context);
  }

  // Called when creature hits stage 5
  async onLegendaryReached(creature: Creature): Promise<string> {
    return SeasonalLoreAgent.generateLegendaryLore(creature);
  }

  private canRunNarration(): boolean {
    const lastRun = this.getLastNarrationTime();
    const fourHours = 4 * 60 * 60 * 1000;
    return !lastRun || Date.now() - lastRun > fourHours;
  }
}
```

---

## Supabase Schema — Agent Tables

```sql
-- Generated narrations cache
create table public.agent_narrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles not null,
  context_hash text not null,     -- Hash of input context
  narration text not null,
  generated_at timestamptz default now(),
  unique(user_id, context_hash)
);

-- Weekly reflections — one per user per week
create table public.weekly_reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles not null,
  week_start date not null,       -- Monday of that week
  reflection text not null,
  generated_at timestamptz default now(),
  unique(user_id, week_start)
);

-- Legendary lore entries — permanent collection
create table public.creature_lore (
  id uuid primary key default gen_random_uuid(),
  creature_id uuid references public.creatures not null unique,
  lore_text text not null,
  generated_at timestamptz default now()
);

-- Season content — shared across all users
create table public.season_content (
  id uuid primary key default gen_random_uuid(),
  season_key text not null unique,  -- "2024_cherry_blossom"
  intro text not null,
  tagline text not null,
  reward_desc text not null,
  generated_at timestamptz default now()
);

-- RLS — users can only read their own agent content
alter table public.agent_narrations enable row level security;
alter table public.weekly_reflections enable row level security;
alter table public.creature_lore enable row level security;

create policy "Users read own narrations" on public.agent_narrations
  for select using (auth.uid() = user_id);
create policy "Users read own reflections" on public.weekly_reflections
  for select using (auth.uid() = user_id);
create policy "Users read own lore" on public.creature_lore
  for select using (auth.uid() = creature_id in (
    select id from public.creatures where user_id = auth.uid()
  ));
-- Season content is public read
create policy "Anyone reads season content" on public.season_content
  for select using (true);
```

---

## Cursor Prompts — Agents

Paste these AFTER the core island is working (after Prompt 5).

### Agent Prompt 1 — Setup
```
Install and configure the Anthropic SDK:
  npm install @anthropic-ai/sdk

Create src/agents/ folder with:
- AgentRunner.ts (singleton class as specified)
- NarrationAgent.ts
- WeeklyReflectionAgent.ts
- CreatureNamingAgent.ts
- SeasonalLoreAgent.ts
- types.ts (all agent context interfaces)
- fallbacks.ts (static fallback strings for all agents)

Add EXPO_PUBLIC_ANTHROPIC_API_KEY to .env.local
Set up the Anthropic client in a shared src/agents/client.ts file.
All agents must handle API failures gracefully and return fallback content.
```

### Agent Prompt 2 — Narration Agent
```
Implement NarrationAgent.ts exactly as specified in the project brief.
- buildNarrationContext() should read from the Zustand islandStore
- Context must never include raw health numbers — only qualitative states
- Cache results in Supabase agent_narrations table using a context hash
- Rate limit to once per 4-hour window using AsyncStorage timestamp
- The narration string should display in IslandCanvas as ambient floating text
  at the bottom of the island, fading in over 1 second on app open
- Write a test that mocks the Anthropic SDK and verifies fallback behavior
```

### Agent Prompt 3 — Creature Naming
```
Implement CreatureNamingAgent.ts as specified.
- Hook into the egg hatch flow — called immediately when egg.progress reaches 1.0
- Show a gentle reveal: egg glows → cracks → creature appears → name fades in
- The name should appear letter by letter (typewriter effect, 80ms per letter)
- Store the generated name in the creatures Supabase table
- Validate name is 1-2 words, letters only, not already used on this island
- Test: verify fallback name pools have no duplicates per species
```

### Agent Prompt 4 — Weekly Reflection
```
Implement WeeklyReflectionAgent.ts as specified.
- Check every Monday at 8am local time using expo-task-manager background task
- Store this week's reflection in weekly_reflections Supabase table
- Display as a soft card on the Today tab — appears Monday, fades after 3 days
- Card design: dark background, creature illustration, reflection text in italic
- If API fails, use a seasonal fallback from the fallbacks.ts pool
- Never show more than one reflection card at a time
```

---

## Environment Variables — Updated

```bash
# .env.local — add to existing vars
ANTHROPIC_API_KEY=your_anthropic_api_key

# Note: In production, agent calls should go through your own backend
# (Supabase Edge Function) so the API key is never in the client bundle.
# For development, direct client calls are fine.
```

## Production Note on API Keys

```typescript
// For production, wrap agent calls in a Supabase Edge Function:
// supabase/functions/generate-narration/index.ts
// This keeps your Anthropic API key server-side only.
// The mobile app calls your Supabase function, which calls Anthropic.
// Add this to your Cursor prompt once the agents are working locally.
```

---

*Habitats — Agent Architecture v1.0 — Added to Cursor Brief*

---

---

# 🌱 TENDING SYSTEM (GOALS)

## Philosophy
Tending is how users set personal intentions and link them to verified data sources.
It layers on top of the organic island system — it never replaces it.
The checklist is celebratory, never punishing. Missing a day is a quiet non-event.
Progress is recorded as "what you did" not "what you failed to do."

---

## Data Types

```typescript
// src/types/tending.ts

export type TendingFrequency = 'daily' | 'weekly';

export type TendingStatus = 'active' | 'completed' | 'expired';

export type VerificationSource =
  | 'healthkit'
  | 'health_connect'
  | 'myfitnesspal'
  | 'strava'
  | 'garmin'
  | 'manual';         // User taps to confirm — no external verification

export interface TendingTemplate {
  id: string;
  name: string;             // "Tend to my Crystal Springs"
  description: string;      // "Drink water consistently"
  zoneId: ZoneId;
  activityType: ActivityType;
  defaultTarget: number;
  targetUnit: string;
  verificationSource: VerificationSource;
  icon: string;
}

export interface TendingIntention {
  id: string;
  userId: string;
  name: string;             // User-written or from template
  zoneId: ZoneId;
  activityType: ActivityType;
  target: number;           // Soft target — direction not hard requirement
  targetUnit: string;
  targetType: 'daily' | 'weekly' | 'more_than_last_week';
  verificationSource: VerificationSource;
  verificationConfig: Record<string, any>;   // Source-specific config
  startDate: string;        // ISO date
  endDate: string;          // ISO date — intentions have a natural lifespan
  status: TendingStatus;
  createdAt: Date;
}

export interface TendingEntry {
  id: string;
  intentionId: string;
  userId: string;
  date: string;             // ISO date
  verified: boolean;        // Did data confirm this?
  verifiedValue: number;    // Actual value from data source
  verifiedAt: Date;
  source: VerificationSource;
}

export interface TendingProgress {
  intentionId: string;
  totalDays: number;        // Days in the intention period
  tendedDays: number;       // Days with verified activity
  currentMonthEntries: TendingEntry[];
  phraseOfProgress: string; // "Tended 18 times this month" — never a percentage
}
```

---

## Tending Templates

```typescript
// src/constants/tendingTemplates.ts

export const TENDING_TEMPLATES: TendingTemplate[] = [
  {
    id: 'crystal_springs_water',
    name: 'Tend to my Crystal Springs',
    description: 'Drink water consistently',
    zoneId: 'crystalsprings',
    activityType: 'hydration',
    defaultTarget: 8,
    targetUnit: 'cups',
    verificationSource: 'myfitnesspal',
    icon: '💧',
  },
  {
    id: 'meadow_steps',
    name: 'Walk with the Meadow',
    description: 'Move a little every day',
    zoneId: 'meadow',
    activityType: 'steps',
    defaultTarget: 7000,
    targetUnit: 'steps',
    verificationSource: 'healthkit',
    icon: '👣',
  },
  {
    id: 'moon_grove_sleep',
    name: 'Honour the Moon Grove',
    description: 'Protect your sleep',
    zoneId: 'moongrove',
    activityType: 'sleep',
    defaultTarget: 420,
    targetUnit: 'minutes',
    verificationSource: 'healthkit',
    icon: '🌙',
  },
  {
    id: 'ember_trail_run',
    name: 'Run the Ember Trail',
    description: 'Keep moving forward',
    zoneId: 'embertrail',
    activityType: 'running',
    defaultTarget: 3000,
    targetUnit: 'meters',
    verificationSource: 'strava',
    icon: '🏃',
  },
  {
    id: 'zen_clearing_mindful',
    name: 'Sit in the Zen Clearing',
    description: 'A few minutes of stillness',
    zoneId: 'zenclearing',
    activityType: 'mindfulness',
    defaultTarget: 10,
    targetUnit: 'minutes',
    verificationSource: 'healthkit',
    icon: '🍃',
  },
  {
    id: 'harvest_glen_nutrition',
    name: 'Tend the Harvest Glen',
    description: 'Log what you eat',
    zoneId: 'harvestglen',
    activityType: 'nutrition',
    defaultTarget: 1,
    targetUnit: 'logged day',
    verificationSource: 'myfitnesspal',
    icon: '🌾',
  },
  // Freeform template — user fills in all fields
  {
    id: 'freeform',
    name: 'Create your own intention',
    description: 'Link any activity to any zone',
    zoneId: 'meadow',          // Default — user changes
    activityType: 'steps',     // Default — user changes
    defaultTarget: 0,
    targetUnit: '',
    verificationSource: 'manual',
    icon: '✨',
  },
];
```

---

## Tending UI — Three Screens

### Screen 1: Tend Tab
```
- List of active intentions with a soft progress visual per intention
- Each card shows:
    - Zone illustration (small, glowing if tended today)
    - Intention name
    - Monthly calendar grid — tended days show a soft filled dot, untended = empty
    - "Tended X times this month" — always phrased as what you DID
    - Today's status: glowing checkmark if verified, soft empty circle if not yet
- "Add an intention" button at bottom
- No streaks displayed anywhere. No percentages. No "X day streak."
```

### Screen 2: Add Intention Flow
```
Step 1: Choose a template OR "create your own"
Step 2: Customize target (soft slider — "a little", "some", "a lot" maps to values)
        Advanced users can tap to enter exact number
Step 3: Choose verification source — shows connected apps first
        If source not connected, gentle "connect to verify automatically,
        or tap to confirm manually"
Step 4: Set duration — this month / next 30 days / ongoing
Step 5: Confirm — shown as "Your intention is set 🌱"
        Island immediately shows a soft glow on the linked zone
```

### Screen 3: Month in Review
```
- Shown at end of each month — gentle card, not a report
- "Your tending this month" — visual garden of dots
- Which zones received the most tending
- A generated sentence from the Narration Agent about the month
- "Start fresh" button — previous intentions archive quietly
```

---

## Verification Engine

```typescript
// src/engine/TendingVerificationEngine.ts

export class TendingVerificationEngine {

  // Runs after each health data sync
  async verifyAllActiveIntentions(
    userId: string,
    intentions: TendingIntention[],
    activityCache: DailyActivity[]
  ): Promise<TendingEntry[]> {
    const today = new Date().toISOString().split('T')[0];
    const newEntries: TendingEntry[] = [];

    for (const intention of intentions) {
      if (intention.status !== 'active') continue;

      // Skip if already verified today
      const alreadyVerified = await this.isVerifiedToday(intention.id, today);
      if (alreadyVerified) continue;

      const verified = await this.checkIntention(intention, activityCache, today);
      if (verified.met) {
        newEntries.push({
          id: crypto.randomUUID(),
          intentionId: intention.id,
          userId,
          date: today,
          verified: true,
          verifiedValue: verified.value,
          verifiedAt: new Date(),
          source: intention.verificationSource,
        });
      }
    }
    return newEntries;
  }

  private async checkIntention(
    intention: TendingIntention,
    activities: DailyActivity[],
    date: string
  ): Promise<{ met: boolean; value: number }> {

    if (intention.verificationSource === 'manual') {
      // Manual intentions are never auto-verified — user taps to confirm
      return { met: false, value: 0 };
    }

    const todayActivities = activities.filter(
      a => a.type === intention.activityType && a.date === date
    );
    const total = todayActivities.reduce((sum, a) => sum + a.value, 0);

    if (intention.targetType === 'more_than_last_week') {
      const lastWeekAvg = this.getLastWeekAverage(activities, intention.activityType, date);
      return { met: total > lastWeekAvg, value: total };
    }

    return { met: total >= intention.target, value: total };
  }

  private getLastWeekAverage(
    activities: DailyActivity[],
    type: ActivityType,
    today: string
  ): number {
    // Average of same day last week ± 2 days
    const values = [];
    for (let d = 5; d <= 9; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - d);
      const dateStr = date.toISOString().split('T')[0];
      const dayTotal = activities
        .filter(a => a.type === type && a.date === dateStr)
        .reduce((sum, a) => sum + a.value, 0);
      if (dayTotal > 0) values.push(dayTotal);
    }
    return values.length > 0
      ? values.reduce((s, v) => s + v, 0) / values.length
      : 0;
  }
}
```

---

## Wellness Principles — Tending Rules

```
1. Soft targets only — no hard pass/fail. "Toward 8 cups" not "8 cups or fail."
2. Language is always additive — "tended X days", never "missed X days"
3. Monthly calendar dots are filled for tended days, EMPTY (not red/X) for untended
4. Intentions expire quietly — no "you abandoned your intention" message
5. Manual verification is always available — no one is locked out for not having an app
6. Target type "more than last week" is always available — meets people where they are
7. Zone glow from tending is ADDITIVE to organic zone level — never replaces it
8. Missing a tended day never affects zone level negatively — only positive contribution
9. No tending leaderboards, no sharing tending progress with friends
10. Max 3 active intentions at once — prevents overwhelm
```

---

---

# 👫 SOCIAL — FRIENDS & VISITING

## Philosophy
Social in Habitats is about *presence and gifting*, not performance or comparison.
You visit a friend's island the way you'd visit someone's home — with curiosity and warmth.
You never see their health data. You never compare islands. You just leave something kind.

---

## Data Types

```typescript
// src/types/social.ts

export interface FriendConnection {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted';
  connectedAt: Date;
  canVisit: boolean;        // Friend has sharing enabled
  lastVisitedAt: Date | null;
}

export interface IslandVisit {
  id: string;
  visitorId: string;
  hostId: string;
  visitedAt: Date;
}

export type DriftgiftType =
  | 'shell'           // Common — found on any beach
  | 'firefly_jar'     // Uncommon — glows at night
  | 'river_stone'     // Common — smooth and warm
  | 'pressed_flower'  // Uncommon — seasonal
  | 'moon_shard'      // Rare — from Moon Grove
  | 'ember_coal'      // Rare — from Ember Trail
  | 'sea_glass'       // Uncommon — from Tidal Lagoon
  | 'golden_acorn';   // Rare — seasonal only

export interface Driftgift {
  id: string;
  fromUserId: string;
  toUserId: string;
  type: DriftgiftType;
  message: string | null;   // Optional short note (max 60 chars)
  sentAt: Date;
  discoveredAt: Date | null; // null = not yet discovered
  beachPosition: { x: number; y: number };
}

export interface PublicIslandView {
  // What a visiting friend can see — NO health data
  ownerDisplayName: string;
  islandAge: number;          // Days since first use
  activeZoneNames: string[];  // Zone names only — not levels or activity types
  creatures: {
    name: string;
    species: CreatureSpecies;
    stage: CreatureStage;
    zoneId: ZoneId;
  }[];
  currentSeason: string;
  timeOfDay: string;
  undiscoveredGifts: number;  // How many gifts waiting (shown to owner only)
}
```

---

## Social Features

### Friend Connections
```
- Add friends via shareable invite link or 6-character island code
- Friend request flow: send → friend accepts → both can visit
- Sharing is opt-in per friendship — you can be friends but keep island private
- Max 20 friends — keeps it intimate, not a social network
- No suggested friends, no "people you may know" — privacy first
```

### Visiting a Friend's Island
```
- Friend's island renders exactly like yours — same isometric view
- Creatures wander normally — you can tap them to see name + species
- Zone names visible, zone LEVELS not shown, activity types not shown
- No numbers anywhere on a visited island
- Cannot interact with anything except leaving a Driftgift
- Visit logged to show friend "someone visited recently" (no name shown by default,
  optional to reveal in settings)
- Stay as long as you want — it's just a peaceful place to be
```

### Driftgifts
```
- Each user has a small inventory of Driftgifts
- Earned via: Moss Coins, seasonal pass rewards, magical moments
- To send: tap "Leave something" while visiting → choose gift type →
  optional short note (60 chars max) → gift appears on their beach
- Owner discovers it organically — no push notification
- Gift washes up in a random beach spot, glows softly
- Tap to reveal: gift type animates open, note appears if included
- Kept in a "Found on my shore" collection — permanent memory
- Sending a gift costs Moss Coins (1-5 depending on rarity)
  Common gifts earnable for free through activity
```

### Friends Tab UI
```
- List of friends with their island name + last active (days ago, not exact time)
- Soft avatar — their island's dominant zone color as a circle
- "Visit" button — loads their island
- "Send a gift" shortcut
- Pending invites section
- Your island code / shareable link
- NO: activity stats, zone levels, health data, comparison of any kind
```

---

## Engagement Loops — Social

```
Discovery loop:
  Friend visits → leaves Driftgift → you open app → notice glowing object on beach
  → tap to discover → feel warm → want to visit their island back

Gifting loop:
  Earn Moss Coins from activity → spend on rare Driftgift → send to friend
  → activity earns social currency → motivation to move

Curiosity loop:
  Friend's island looks different than last week → their moon grove grew →
  wonder what they've been doing → no data shown → mystery preserved → revisit

Seasonal loop:
  Seasonal gifts only available during that season → create urgency without anxiety
  → "I want to send a Cherry Blossom pressed flower before the season ends"
```

---

## Wellness Principles — Social Rules

```
1. No health data ever visible to friends — zones show as living environments only
2. No comparison between islands — no "your island vs friend's island"
3. No leaderboards, no activity rankings, no steps comparisons
4. Visiting is passive — you watch, you leave something kind, you go
5. Driftgift messages are 60 chars max — a note, not a conversation
  (Habitats is not a messaging app)
6. Friend count capped at 20 — intimate circle, not a follower system
7. Visit notifications are opt-in — default is silent discovery
8. No public profiles — islands are only visible to accepted friends
9. "Someone visited recently" is the most specific social signal shown
10. Gifting costs something (Moss Coins) — makes it meaningful, not spam
```

---

## Supabase Schema — Social & Tending

```sql
-- Tending intentions
create table public.tending_intentions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles not null,
  name text not null,
  zone_id text not null,
  activity_type text not null,
  target float not null,
  target_unit text not null,
  target_type text not null default 'daily',
  verification_source text not null,
  verification_config jsonb default '{}',
  start_date date not null,
  end_date date,
  status text not null default 'active',
  created_at timestamptz default now()
);

-- Tending entries — one per verified day
create table public.tending_entries (
  id uuid primary key default gen_random_uuid(),
  intention_id uuid references public.tending_intentions not null,
  user_id uuid references public.profiles not null,
  date date not null,
  verified boolean not null default false,
  verified_value float,
  verified_at timestamptz,
  source text not null,
  unique(intention_id, date)
);

-- Friend connections
create table public.friend_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles not null,
  friend_id uuid references public.profiles not null,
  status text not null default 'pending',
  can_visit boolean default false,
  connected_at timestamptz default now(),
  unique(user_id, friend_id)
);

-- Island visit log
create table public.island_visits (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid references public.profiles not null,
  host_id uuid references public.profiles not null,
  visited_at timestamptz default now()
);

-- Driftgifts
create table public.driftgifts (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references public.profiles not null,
  to_user_id uuid references public.profiles not null,
  gift_type text not null,
  message text check (char_length(message) <= 60),
  sent_at timestamptz default now(),
  discovered_at timestamptz,
  beach_position_x float not null,
  beach_position_y float not null
);

-- User island codes for sharing
create table public.island_codes (
  user_id uuid references public.profiles primary key,
  code text not null unique,    -- 6 char alphanumeric
  created_at timestamptz default now()
);

-- RLS
alter table public.tending_intentions enable row level security;
alter table public.tending_entries enable row level security;
alter table public.friend_connections enable row level security;
alter table public.island_visits enable row level security;
alter table public.driftgifts enable row level security;
alter table public.island_codes enable row level security;

create policy "Users own tending" on public.tending_intentions
  for all using (auth.uid() = user_id);
create policy "Users own entries" on public.tending_entries
  for all using (auth.uid() = user_id);
create policy "Users see own connections" on public.friend_connections
  for all using (auth.uid() = user_id or auth.uid() = friend_id);
create policy "Hosts see visits" on public.island_visits
  for select using (auth.uid() = host_id or auth.uid() = visitor_id);
create policy "Users see own gifts" on public.driftgifts
  for all using (auth.uid() = from_user_id or auth.uid() = to_user_id);
create policy "Users own island code" on public.island_codes
  for all using (auth.uid() = user_id);
```

---

## Cursor Prompts — Tending & Social

### Tending Prompt 1 — Intentions Store & Engine
```
Implement the TendingVerificationEngine as specified.
Create a tendingStore in Zustand with:
  - activeIntentions: TendingIntention[]
  - entries: Record<string, TendingEntry[]>  (keyed by intentionId)
  - addIntention(template, customizations)
  - verifyToday(intentionId)   // manual tap verification
  - getProgress(intentionId): TendingProgress

TendingProgress.phraseOfProgress must ALWAYS be phrased as
"Tended X times" or "Tended X days this month" — never as a percentage,
never as "missed", never as a ratio.
Write unit tests for phraseOfProgress generation.
```

### Tending Prompt 2 — Tend Tab UI
```
Build the Tend tab screen with:
- List of active TendingIntention cards
- Each card shows a 5-week calendar grid of dots (filled = tended, empty = not)
- Dots are the zone's light color when filled, rgba(255,255,255,0.1) when empty
- NO red dots, NO X marks, NO streak indicators
- Today's dot pulses softly if not yet tended
- "Tended X times this month" label under each card
- Tap card → expand to show verification source and manual confirm button
- "Add intention" sheet with template picker and freeform option
- Max 3 active intentions enforced in UI
```

### Social Prompt 1 — Friends & Visiting
```
Build the Friends tab with:
- Friend list showing display name + dominant zone color avatar + "Visit" button
- Add friend flow: enter island code → send request → pending state
- Generate a unique 6-char island code for each user on signup (store in island_codes)
- "Visit" loads a read-only version of IslandCanvas with the friend's PublicIslandView
- Visited island shows creatures wandering but no zone level numbers
- "Leave a gift" FAB appears when visiting — opens Driftgift picker
- Driftgift renders on beach as a glowing SVG object
- Owner discovers it with no notification — glowing object just appears on next open
```

---
 We are connecting real health data to the island.
The app runs on Expo 56, Reanimated 4.4.0, Skia 2.6.4.

Implement health data integration in this exact order.
Do not move to the next step until the current one compiles and runs.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — INSTALL & CONFIGURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Install these packages:
  expo-health-connect       # Android Health Connect
  react-native-health       # iOS HealthKit

For expo-health-connect, add to app.json plugins:
  ["expo-health-connect"]

For react-native-health, add to app.json:
  {
    "plugin": "react-native-health",
    "config": {
      "NSHealthShareUsageDescription": "Habitats reads your activity to grow your island world.",
      "NSHealthUpdateUsageDescription": "Habitats does not write health data.",
      "healthKitPermissions": {
        "read": [
          "Steps",
          "SleepAnalysis", 
          "DistanceWalkingRunning",
          "DistanceCycling",
          "DistanceSwimming",
          "ActiveEnergyBurned",
          "Workout",
          "MindfulSession",
          "DietaryWater"
        ],
        "write": []
      }
    }
  }

Add to AndroidManifest.xml inside <manifest>:
  <uses-permission android:name="android.permission.health.READ_STEPS"/>
  <uses-permission android:name="android.permission.health.READ_SLEEP"/>
  <uses-permission android:name="android.permission.health.READ_DISTANCE"/>
  <uses-permission android:name="android.permission.health.READ_EXERCISE"/>
  <uses-permission android:name="android.permission.health.READ_ACTIVE_CALORIES_BURNED"/>
  <uses-permission android:name="android.permission.health.READ_TOTAL_CALORIES_BURNED"/>

Add Health Connect activity to AndroidManifest.xml inside <application>:
  <activity
    android:name="androidx.health.connect.client.PermissionController"
    android:exported="true">
    <intent-filter>
      <action android:name="androidx.health.connect.client.SHOW_PERMISSIONS_RATIONALE"/>
    </intent-filter>
  </activity>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — SHARED NORMALIZER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create src/health/HealthNormalizer.ts

This is the single output format everything converts to.
Both HealthKit and Health Connect output must produce this:

export interface DailyActivity {
  date: string           // "YYYY-MM-DD"
  type: ActivityType     // from src/types/activity.ts
  value: number          // normalized unit (steps=count, sleep=minutes, distance=meters)
  unit: string
  source: string         // "healthkit" | "health_connect" | "strava" | "manual"
}

export interface NormalizedHealthData {
  fetchedAt: Date
  source: string
  activities: DailyActivity[]
}

export function normalizeToActivitySummaries(
  activities: DailyActivity[],
  today: Date
): ActivitySummary[] {
  // For each ActivityType, call ZoneEngine.calculateActivityLevel()
  // Return one ActivitySummary per type that has any data
  // Include qualitative trend: compare last 7 days vs previous 7 days
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — ANDROID: HEALTH CONNECT BRIDGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create src/health/HealthConnectBridge.ts

import {
  initialize,
  requestPermission,
  readRecords,
  getSdkStatus,
  SdkAvailabilityStatus,
} from 'expo-health-connect'

The bridge must implement this interface:
export interface HealthBridge {
  isAvailable(): Promise<boolean>
  requestPermissions(): Promise<boolean>
  fetchLast14Days(): Promise<NormalizedHealthData>
}

isAvailable():
  Use getSdkStatus() — return true only if status === SdkAvailabilityStatus.SDK_AVAILABLE
  If Health Connect not installed, return false (do not crash)

requestPermissions():
  Request these record types:
  ['Steps', 'SleepSession', 'Distance', 'ExerciseSession', 
   'ActiveCaloriesBurned', 'MindfulnessSession']
  Return true if all granted, false if any denied

fetchLast14Days():
  Fetch each data type for last 14 days using readRecords()
  Date range: startTime = 14 days ago 00:00:00, endTime = now

  Steps → ActivityType 'steps', value = count per day (sum daily)
  SleepSession → ActivityType 'sleep', value = duration in minutes
    Only count sleep tagged as 'SLEEP_STAGE_T

*Habitats — Tending & Social Systems v1.0 — Added to Cursor Brief*

What's left, roughly in priority order:
Must-have before it feels like a real app:

Health data (HealthKit + Health Connect) — right now zones are static mock data. This is what makes the island yours
Egg hatching sequence — the emotional payoff moment
Creature stage visual differences — stage 1 should look genuinely tiny vs stage 4
Supabase auth + basic cloud sync — so data survives app restarts
Onboarding flow — the first 60 seconds matters enormously

Makes it sticky:

Narration Agent — island starts talking
Tending tab — the gentle checklist
Weekly reflection — reason to come back Mondays

Makes it a product:

Season pass + Moss Coins economy
Friends + Driftgifts
App Store assets + submission