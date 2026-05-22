/**
 * IslandCanvas.tsx
 * Root Skia canvas — sky, animated floating island base, zone hooks (Prompt 4).
 */
import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import {
  Canvas,
  Fill,
  LinearGradient,
  vec,
} from '@shopify/react-native-skia';
import type { Creature } from '../types/creature';
import { ZoneData, ZoneId } from '../types/zone';
import { CreatureSprite } from './creatures/CreatureSprite';
import { getZonesToRender } from './getZonesToRender';
import { IslandBase } from './IslandBase';
import { useAnimatedIslandScale } from './hooks/useAnimatedIslandScale';
import { useAnimatedZoneLevels } from './hooks/useAnimatedZoneLevels';
import type { ViewBoxLayout } from './viewBox';
import { ZoneRenderer } from './zones/ZoneRenderer';

export interface IslandCanvasProps {
  zones: Partial<Record<ZoneId, ZoneData>>;
  islandScale: number;
  creatures?: Creature[];
  ambientText?: string;
}

const SKY_TOP = '#2a1848';
const SKY_BOTTOM = '#1a1030';

export function IslandCanvas({
  zones,
  islandScale,
  creatures = [],
}: IslandCanvasProps) {
  const { width, height } = useWindowDimensions();
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
            zoneIsNeglected={zone.isNeglected}
            layout={layout}
          />
        );
      }),
    [creatures, zones, layout]
  );

  if (width <= 0 || height <= 0) {
    return null;
  }

  return (
    <Canvas style={styles.canvas}>
      <Fill>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, height)}
          colors={[SKY_TOP, SKY_BOTTOM]}
        />
      </Fill>

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
