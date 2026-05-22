import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyActivity, ActivitySummary } from '../types/activity';

interface HealthStore {
  rawActivities: DailyActivity[];      // Last 30 days from all sources
  activitySummaries: ActivitySummary[]; // Computed 0.0–1.0 levels
  isHealthPermissionGranted: boolean;
  lastFetchedAt: Date | null;

  setRawActivities: (activities: DailyActivity[]) => void;
  setActivitySummaries: (summaries: ActivitySummary[]) => void;
  setHealthPermissionGranted: (granted: boolean) => void;
  setLastFetchedAt: (date: Date) => void;
}

export const useHealthStore = create<HealthStore>()(
  persist(
    (set) => ({
      rawActivities: [],
      activitySummaries: [],
      isHealthPermissionGranted: false,
      lastFetchedAt: null,

      setRawActivities: (activities) => set({ rawActivities: activities }),
      setActivitySummaries: (summaries) => set({ activitySummaries: summaries }),
      setHealthPermissionGranted: (granted) => set({ isHealthPermissionGranted: granted }),
      setLastFetchedAt: (date) => set({ lastFetchedAt: date }),
    }),
    {
      name: 'health-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
