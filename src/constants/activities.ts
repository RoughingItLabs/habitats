import { ActivityType } from '../types/activity';
import { ZoneId } from '../types/zone';

// Activity type → zone that it powers
export const ACTIVITY_TO_ZONE: Record<ActivityType, ZoneId> = {
  steps:       'meadow',
  sleep:       'moongrove',
  running:     'embertrail',
  swimming:    'tidallagoon',
  strength:    'stonepeak',
  cycling:     'windspire',
  mindfulness: 'zenclearing',
  hydration:   'crystalsprings',
  nutrition:   'harvestglen',
};

export const ACTIVITY_DISPLAY_NAMES: Record<ActivityType, string> = {
  steps:       'Steps',
  sleep:       'Sleep',
  running:     'Running',
  swimming:    'Swimming',
  strength:    'Strength',
  cycling:     'Cycling',
  mindfulness: 'Mindfulness',
  hydration:   'Hydration',
  nutrition:   'Nutrition',
};
