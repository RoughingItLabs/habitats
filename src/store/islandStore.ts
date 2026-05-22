import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ZoneData, ZoneId } from '../types/zone';
import { ActivitySummary } from '../types/activity';
import { ZONE_DEFINITIONS } from '../constants/zones';
import { levelToZoneState } from '../engine/ZoneEngine';

interface IslandStore {
  zones: Record<ZoneId, ZoneData>;
  islandScale: number;
  lastSynced: Date | null;

  updateZones: (activities: ActivitySummary[]) => void;
  setIslandScale: (scale: number) => void;
  setLastSynced: (date: Date) => void;
}

const DEFAULT_ZONES = Object.fromEntries(
  (Object.keys(ZONE_DEFINITIONS) as ZoneId[]).map((id) => {
    const def = ZONE_DEFINITIONS[id];
    const zone: ZoneData = {
      id,
      activityType: def.activityType,
      level: 0,
      state: 'absent',
      lastUpdated: new Date(),
      peakLevelEver: 0,
      isNeglected: false,
    };
    return [id, zone];
  })
) as Record<ZoneId, ZoneData>;

export const useIslandStore = create<IslandStore>()(
  persist(
    (set, get) => ({
      zones: DEFAULT_ZONES,
      islandScale: 0.75,
      lastSynced: null,

      updateZones: (activities) => {
        const currentZones = get().zones;
        const updated = { ...currentZones };

        for (const summary of activities) {
          const zoneEntry = Object.values(ZONE_DEFINITIONS).find(
            d => d.activityType === summary.type
          );
          if (!zoneEntry) continue;

          const existing = updated[zoneEntry.id];
          const newLevel = summary.level;
          const peakLevelEver = Math.max(newLevel, existing?.peakLevelEver ?? 0);

          updated[zoneEntry.id] = {
            ...existing,
            level: newLevel,
            state: levelToZoneState(newLevel),
            peakLevelEver,
            lastUpdated: new Date(),
          };
        }

        set({ zones: updated });
      },

      setIslandScale: (scale) => set({ islandScale: scale }),
      setLastSynced: (date) => set({ lastSynced: date }),
    }),
    {
      name: 'island-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
