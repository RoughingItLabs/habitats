import { ZoneDefinition, ZoneId } from '../types/zone';
import { ActivityType } from '../types/activity';

export const GOAL_REFERENCES: Record<ActivityType, number> = {
  steps:       7000,   // steps/day
  sleep:       480,    // minutes/day (8 hours)
  running:     2143,   // meters/day (15000m/week)
  swimming:    286,    // meters/day (2000m/week)
  strength:    0.29,   // sessions/day (2/week)
  cycling:     4286,   // meters/day (30000m/week)
  mindfulness: 10,     // minutes/day
  hydration:   8,      // cups/day
  nutrition:   1,      // logged day = 1
};

export const ZONE_DEFINITIONS: Record<ZoneId, ZoneDefinition> = {
  moongrove: {
    id: 'moongrove',
    name: 'Moon Grove',
    activityType: 'sleep',
    colors: { primary: '#4A3A7A', mid: '#7A6AAA', light: '#C4B5D9', glow: '#E8D8FF' },
    basePosition: { x: 12, y: 30 },
    baseSize: { w: 28, h: 26 },
    goalReference: 480,
    goalUnit: 'minutes',
  },
  meadow: {
    id: 'meadow',
    name: 'Sunlit Meadow',
    activityType: 'steps',
    colors: { primary: '#4A7A50', mid: '#6AAA70', light: '#A8D890', glow: '#D4F0B8' },
    basePosition: { x: 36, y: 44 },
    baseSize: { w: 30, h: 22 },
    goalReference: 7000,
    goalUnit: 'steps',
  },
  embertrail: {
    id: 'embertrail',
    name: 'Ember Trail',
    activityType: 'running',
    colors: { primary: '#8A3A10', mid: '#C46020', light: '#F5C9A0', glow: '#FFE8C0' },
    basePosition: { x: 58, y: 28 },
    baseSize: { w: 26, h: 24 },
    goalReference: 2143,
    goalUnit: 'meters',
  },
  tidallagoon: {
    id: 'tidallagoon',
    name: 'Tidal Lagoon',
    activityType: 'swimming',
    colors: { primary: '#1A5A7A', mid: '#2A7A9A', light: '#A8D4E6', glow: '#C8F0FF' },
    basePosition: { x: 26, y: 64 },
    baseSize: { w: 24, h: 18 },
    goalReference: 286,
    goalUnit: 'meters',
  },
  zenclearing: {
    id: 'zenclearing',
    name: 'Zen Clearing',
    activityType: 'mindfulness',
    colors: { primary: '#3A6A5A', mid: '#5A9A7A', light: '#A8D4C0', glow: '#C8EEE0' },
    basePosition: { x: 60, y: 57 },
    baseSize: { w: 20, h: 17 },
    goalReference: 10,
    goalUnit: 'minutes',
  },
  stonepeak: {
    id: 'stonepeak',
    name: 'Stone Peak',
    activityType: 'strength',
    colors: { primary: '#5A5040', mid: '#8A7A6A', light: '#C4B4A4', glow: '#E4D8C8' },
    basePosition: { x: 58, y: 44 },
    baseSize: { w: 18, h: 16 },
    goalReference: 0.29,
    goalUnit: 'sessions',
  },
  crystalsprings: {
    id: 'crystalsprings',
    name: 'Crystal Springs',
    activityType: 'hydration',
    colors: { primary: '#2A6A8A', mid: '#4A9ABA', light: '#A8D8F0', glow: '#C8F0FF' },
    basePosition: { x: 20, y: 50 },
    baseSize: { w: 18, h: 15 },
    goalReference: 8,
    goalUnit: 'cups',
  },
  harvestglen: {
    id: 'harvestglen',
    name: 'Harvest Glen',
    activityType: 'nutrition',
    colors: { primary: '#6A5A20', mid: '#9A8A40', light: '#D4C480', glow: '#F0E0A0' },
    basePosition: { x: 44, y: 62 },
    baseSize: { w: 18, h: 14 },
    goalReference: 1,
    goalUnit: 'logged day',
  },
  windspire: {
    id: 'windspire',
    name: 'Wind Spire',
    activityType: 'cycling',
    colors: { primary: '#2A4A6A', mid: '#4A7AAA', light: '#A8C8E8', glow: '#C8E8FF' },
    basePosition: { x: 70, y: 42 },
    baseSize: { w: 16, h: 14 },
    goalReference: 4286,
    goalUnit: 'meters',
  },
};
