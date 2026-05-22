/**
 * AgentRunner.ts
 * Central coordinator — manages all agent calls, rate limiting, caching.
 * Singleton pattern — one runner for the whole app.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateIslandNarration } from './NarrationAgent';
import { generateWeeklyReflection } from './WeeklyReflectionAgent';
import { generateCreatureName } from './CreatureNamingAgent';
import { generateLegendaryLore } from './SeasonalLoreAgent';
import { NarrationContext, WeeklyReflectionContext, CreatureNamingContext } from './types';
import { IslandState, TimeOfDay, Season } from '../types/island';
import { Creature, Egg } from '../types/creature';
import { ZONE_DEFINITIONS } from '../constants/zones';

const NARRATION_COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours
const LAST_NARRATION_KEY = '@habitats/lastNarrationTime';

export class AgentRunner {
  private static instance: AgentRunner;

  static getInstance(): AgentRunner {
    if (!AgentRunner.instance) {
      AgentRunner.instance = new AgentRunner();
    }
    return AgentRunner.instance;
  }

  /** Called on every app foreground — respects 4-hour rate limit */
  async onAppOpen(
    userId: string,
    islandState: IslandState,
    timeOfDay: TimeOfDay,
    season: Season
  ): Promise<string | null> {
    if (!(await this.canRunNarration())) return null;

    const context = this.buildNarrationContext(islandState, timeOfDay, season);
    const narration = await generateIslandNarration(userId, context);

    await AsyncStorage.setItem(LAST_NARRATION_KEY, Date.now().toString());
    return narration;
  }

  /** Called on Monday mornings */
  async onWeeklyTrigger(
    userId: string,
    islandState: IslandState,
    season: Season
  ): Promise<string | null> {
    const context = this.buildWeeklyContext(userId, islandState, season);
    return generateWeeklyReflection(context);
  }

  /** Called when egg hatches */
  async onEggHatch(
    egg: Egg,
    islandState: IslandState,
    timeOfDay: TimeOfDay,
    season: Season
  ): Promise<string> {
    const zoneDef = ZONE_DEFINITIONS[egg.zoneId];
    const existingNames = islandState.creatures.map(c => c.name);

    const context: CreatureNamingContext = {
      species: egg.species,
      zoneName: zoneDef.name,
      zoneActivity: zoneDef.activityType,
      dominantActivities: this.getDominantActivities(islandState),
      timeOfHatch: timeOfDay,
      season,
      existingCreatureNames: existingNames,
    };

    return generateCreatureName(context);
  }

  /** Called when creature reaches stage 5 */
  async onLegendaryReached(
    creature: Creature,
    islandAge: number,
    season: Season
  ): Promise<string> {
    return generateLegendaryLore(creature, islandAge, season);
  }

  private async canRunNarration(): Promise<boolean> {
    const lastRun = await AsyncStorage.getItem(LAST_NARRATION_KEY);
    if (!lastRun) return true;
    return Date.now() - parseInt(lastRun, 10) > NARRATION_COOLDOWN_MS;
  }

  private buildNarrationContext(
    state: IslandState,
    timeOfDay: TimeOfDay,
    season: Season
  ): NarrationContext {
    return {
      zones: Object.values(state.zones).map(zone => ({
        id: zone.id,
        state: zone.state,
        level: zone.level,
        isNeglected: zone.isNeglected,
        creatures: state.creatures
          .filter(c => c.zoneId === zone.id)
          .map(c => ({ name: c.name, species: c.species, stage: c.stage })),
      })),
      timeOfDay,
      season,
      recentActivity: Object.values(state.zones).map(zone => ({
        type: zone.activityType,
        quality: this.levelToQuality(zone.level),
      })),
      hasNewEgg: state.eggs.length > 0,
      hasNewLegendary: state.creatures.some(c => c.isLegendary),
    };
  }

  private buildWeeklyContext(
    userId: string,
    state: IslandState,
    season: Season
  ): WeeklyReflectionContext {
    return {
      userId,
      weekSummary: Object.values(state.zones).map(zone => ({
        zoneId: zone.id,
        zoneName: ZONE_DEFINITIONS[zone.id].name,
        levelStart: 0, // TODO: Compare with last week's snapshot
        levelEnd: zone.level,
        trend: 'stable' as const,
        creatureNames: state.creatures
          .filter(c => c.zoneId === zone.id)
          .map(c => c.name),
      })),
      biggestGrowth: null,
      mostNeglected: null,
      newCreaturesThisWeek: [],
      legendariesThisWeek: state.creatures.filter(c => c.isLegendary).map(c => c.name),
      islandAge: state.islandAge,
      season,
    };
  }

  private getDominantActivities(state: IslandState) {
    return Object.values(state.zones)
      .sort((a, b) => b.level - a.level)
      .slice(0, 3)
      .map(z => z.activityType);
  }

  private levelToQuality(level: number): 'strong' | 'gentle' | 'quiet' | 'absent' {
    if (level >= 0.7) return 'strong';
    if (level >= 0.35) return 'gentle';
    if (level >= 0.03) return 'quiet';
    return 'absent';
  }
}
