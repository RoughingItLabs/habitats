import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ZoneData, ZoneId } from '../types/zone';
import { ActivitySummary } from '../types/activity';
import { ZONE_DEFINITIONS } from '../constants/zones';
import { levelToZoneState } from '../engine/ZoneEngine';
import {
  readDeviceTime,
  type TimeOfDay,
} from '../engine/TimeEngine';
import type { WeatherType } from '../engine/WeatherEngine';

const initialTime = readDeviceTime();

interface IslandStore {
  zones: Record<ZoneId, ZoneData>;
  islandScale: number;
  lastSynced: Date | null;
  timeOfDay: TimeOfDay;
  timeProgress: number;
  weather: WeatherType;
  lastWeatherHour: number | null;
  lastWeatherTimeOfDay: TimeOfDay | null;

  updateZones: (activities: ActivitySummary[]) => void;
  setIslandScale: (scale: number) => void;
  setLastSynced: (date: Date) => void;
  syncDeviceTime: () => void;
  setWeather: (weather: WeatherType) => void;
  setWeatherSnapshot: (hour: number, timeOfDay: TimeOfDay) => void;
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
      timeOfDay: initialTime.timeOfDay,
      timeProgress: initialTime.timeProgress,
      weather: 'clear',
      lastWeatherHour: null,
      lastWeatherTimeOfDay: null,

      syncDeviceTime: () => {
        const { timeOfDay, timeProgress } = readDeviceTime();
        set({ timeOfDay, timeProgress });
      },

      setWeather: (weather) => set({ weather }),
      setWeatherSnapshot: (hour, timeOfDay) =>
        set({ lastWeatherHour: hour, lastWeatherTimeOfDay: timeOfDay }),

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
      merge: (persistedState, currentState) => {
        const ps = persistedState as Partial<IslandStore>;
        // Rebuild zones so every zone from ZONE_DEFINITIONS is always present
        // and every zone object has the current schema fields (handles migrations).
        const mergedZones: Record<ZoneId, ZoneData> = { ...currentState.zones };
        if (ps.zones) {
          for (const id of Object.keys(ZONE_DEFINITIONS) as ZoneId[]) {
            const stored = ps.zones[id];
            if (stored) {
              mergedZones[id] = {
                ...mergedZones[id],
                ...(stored as ZoneData),
                isNeglected: (stored as ZoneData).isNeglected ?? false,
              };
            }
          }
        }
        return { ...currentState, ...ps, zones: mergedZones };
      },
    }
  )
);
