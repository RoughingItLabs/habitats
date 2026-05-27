import { ZoneData, ZoneId } from './zone';
import { Creature, Egg } from './creature';
import { ActivityType } from './activity';

export interface IslandState {
  zones: Record<ZoneId, ZoneData>;
  creatures: Creature[];
  eggs: Egg[];
  islandScale: number;     // 0.75 – 1.1
  islandAge: number;       // Days since first use
  lastSynced: Date | null;
}

export type { TimeOfDay } from '../engine/TimeEngine';
import type { TimeOfDay } from '../engine/TimeEngine';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface IslandEnvironment {
  timeOfDay: TimeOfDay;
  season: Season;
}
