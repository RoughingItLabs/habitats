import { ZoneId } from './zone';

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
  name: string;           // User-set or auto-generated
  stage: CreatureStage;
  zoneId: ZoneId;
  xpProgress: number;     // 0.0 – 1.0 toward next stage
  isLegendary: boolean;
  hasGraduated: boolean;  // Moved to collection
  discoveredAt: Date;
}

export interface Egg {
  id: string;
  species: CreatureSpecies;
  zoneId: ZoneId;
  progress: number;       // 0.0 – 1.0 toward hatching
  discoveredAt: Date;
  beachPosition: { x: number; y: number };
}
