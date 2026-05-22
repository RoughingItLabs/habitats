/**
 * sync.ts
 * Local Zustand state → Supabase cloud sync.
 * Offline-first: always reads/writes local state first.
 */
import { supabase } from './client';
import { ZoneData, ZoneId } from '../types/zone';
import { Creature, Egg } from '../types/creature';
import { DailyActivity } from '../types/activity';

export async function syncZonesToCloud(
  userId: string,
  zones: Record<ZoneId, ZoneData>
): Promise<void> {
  const rows = Object.values(zones).map(zone => ({
    user_id: userId,
    zone_id: zone.id,
    level: zone.level,
    peak_level: zone.peakLevelEver,
    is_neglected: zone.isNeglected,
    last_updated: zone.lastUpdated.toISOString(),
  }));

  const { error } = await supabase
    .from('island_state')
    .upsert(rows, { onConflict: 'user_id,zone_id' });

  if (error) console.error('[sync] Zone sync failed:', error.message);
}

export async function syncActivitiesToCloud(
  userId: string,
  activities: DailyActivity[]
): Promise<void> {
  const rows = activities.map(a => ({
    user_id: userId,
    date: a.date,
    activity_type: a.type,
    value: a.value,
    unit: a.unit,
    source: a.source,
  }));

  const { error } = await supabase
    .from('activity_cache')
    .upsert(rows, { onConflict: 'user_id,date,activity_type,source' });

  if (error) console.error('[sync] Activity sync failed:', error.message);
}
