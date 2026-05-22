import { ZoneId, ZoneState } from '../types/zone';
import { ActivityType } from '../types/activity';
import { CreatureSpecies, CreatureStage } from '../types/creature';
import { TimeOfDay, Season } from '../types/island';

export interface NarrationContext {
  zones: {
    id: ZoneId;
    state: ZoneState;
    level: number;
    isNeglected: boolean;
    creatures: { name: string; species: string; stage: CreatureStage }[];
  }[];
  timeOfDay: TimeOfDay;
  season: Season;
  recentActivity: {
    type: ActivityType;
    quality: 'strong' | 'gentle' | 'quiet' | 'absent';
  }[];
  hasNewEgg: boolean;
  hasNewLegendary: boolean;
}

export interface WeeklyReflectionContext {
  userId: string;
  weekSummary: {
    zoneId: ZoneId;
    zoneName: string;
    levelStart: number;
    levelEnd: number;
    trend: 'rising' | 'stable' | 'falling' | 'new';
    creatureNames: string[];
  }[];
  biggestGrowth: ZoneId | null;
  mostNeglected: ZoneId | null;
  newCreaturesThisWeek: string[];
  legendariesThisWeek: string[];
  islandAge: number;
  season: Season;
}

export interface CreatureNamingContext {
  species: CreatureSpecies;
  zoneName: string;
  zoneActivity: ActivityType;
  dominantActivities: ActivityType[];
  timeOfHatch: TimeOfDay;
  season: Season;
  existingCreatureNames: string[];
}

export interface LegendaryLoreContext {
  creatureName: string;
  species: CreatureSpecies;
  zoneName: string;
  zoneActivity: ActivityType;
  daysOnIsland: number;
  season: Season;
}

export interface SeasonContext {
  seasonName: string;
  realWorldSeason: Season;
  year: number;
  themeTags: string[];
  featuredZone: ZoneId;
  featuredCreature: CreatureSpecies;
}
