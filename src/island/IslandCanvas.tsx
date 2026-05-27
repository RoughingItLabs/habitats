/**
 * IslandCanvas.tsx
 * Root Skia canvas — sky, weather, animated floating island base, zones, creatures.
 */
import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import type { Creature } from '../types/creature';
import { ZoneData, ZoneId } from '../types/zone';
import { useIslandStore } from '../store/islandStore';
import { CreatureSprite } from './creatures/CreatureSprite';
import { SkyLayer } from './effects/SkyLayer';
import { WeatherLayer } from './effects/WeatherLayer';
import { getZonesToRender } from './getZonesToRender';
import { IslandBase } from './IslandBase';
import { useAnimatedIslandScale } from './hooks/useAnimatedIslandScale';
import { useAnimatedZoneLevels } from './hooks/useAnimatedZoneLevels';
import { useIslandTime } from './hooks/useIslandTime';
import { useIslandWeather } from './hooks/useIslandWeather';
import type { ViewBoxLayout } from './viewBox';
import { ZoneRenderer } from './zones/ZoneRenderer';

export interface IslandCanvasProps {
  zones: Partial<Record<ZoneId, ZoneData>>;
  islandScale: number;
  creatures?: Creature[];
  ambientText?: string;
}

export function IslandCanvas({
  zones,
  islandScale,
  creatures = [],
}: IslandCanvasProps) {
  const { width, height } = useWindowDimensions();
  const timeOfDay = useIslandStore(state => state.timeOfDay);

  useIslandTime();
  useIslandWeather();

  const layout: ViewBoxLayout = useMemo(
    () => ({ width, height }),
    [width, height]
  );

  const animatedScale = useAnimatedIslandScale(islandScale);
  const animatedZoneLevels = useAnimatedZoneLevels(zones);

  const zoneNodes = useMemo(
    () =>
      getZonesToRender(zones).map(zone => (
        <ZoneRenderer
          key={zone.id}
          zone={zone}
          layout={layout}
          animatedLevel={animatedZoneLevels[zone.id]}
        />
      )),
    [zones, layout, animatedZoneLevels]
  );

  const creatureNodes = useMemo(
    () =>
      creatures.map(creature => {
        const zone = zones[creature.zoneId];
        if (!zone) {
          return null;
        }
        return (
          <CreatureSprite
            key={creature.id}
            creature={creature}
            zone={zone}
            timeOfDay={timeOfDay}
            layout={layout}
          />
        );
      }),
    [creatures, zones, layout, timeOfDay]
  );

  if (width <= 0 || height <= 0) {
    return null;
  }

  return (
    <Canvas style={styles.canvas}>
      <SkyLayer width={width} height={height} />
      <WeatherLayer layout={layout} zones={zones} />
      <IslandBase layout={layout} scale={animatedScale} />
      {zoneNodes}
      {creatureNodes}
    </Canvas>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
});
