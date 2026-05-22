import { ActivityType } from './activity';

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
  basePosition: { x: number; y: number }; // % of viewBox
  baseSize: { w: number; h: number };
  goalReference: number;   // Soft reference value for level=1.0 calc
  goalUnit: string;
}
