import { useEffect } from 'react';
import {
  determineWeather,
  sleepActivityLevelFromZones,
} from '../../engine/WeatherEngine';
import { useIslandStore } from '../../store/islandStore';

/** Recompute island weather at most once per clock hour. */
export function useIslandWeather(): void {
  const zones = useIslandStore(state => state.zones);
  const timeOfDay = useIslandStore(state => state.timeOfDay);
  const setWeather = useIslandStore(state => state.setWeather);
  const setWeatherSnapshot = useIslandStore(state => state.setWeatherSnapshot);
  const lastWeatherHour = useIslandStore(state => state.lastWeatherHour);
  const lastWeatherTimeOfDay = useIslandStore(
    state => state.lastWeatherTimeOfDay
  );

  useEffect(() => {
    const hour = new Date().getHours();
    if (
      lastWeatherHour === hour &&
      lastWeatherTimeOfDay === timeOfDay
    ) {
      return;
    }
    const weather = determineWeather({
      timeOfDay,
      zones,
      sleepActivityLevel: sleepActivityLevelFromZones(zones),
    });
    setWeather(weather);
    setWeatherSnapshot(hour, timeOfDay);
  }, [
    zones,
    timeOfDay,
    lastWeatherHour,
    lastWeatherTimeOfDay,
    setWeather,
    setWeatherSnapshot,
  ]);
}
