import { useEffect } from 'react';
import { useIslandStore } from '../../store/islandStore';

const TICK_MS = 60_000;

/** Sync device clock into islandStore every 60 seconds. */
export function useIslandTime(): void {
  const syncDeviceTime = useIslandStore(state => state.syncDeviceTime);

  useEffect(() => {
    syncDeviceTime();
    const id = setInterval(syncDeviceTime, TICK_MS);
    return () => clearInterval(id);
  }, [syncDeviceTime]);
}
