/**
 * Floating landmass — layered ellipses (shadow, beach ring, land, highland).
 * All geometry is defined in 0–100 viewBox units.
 */
import React from 'react';
import { Group, Oval } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';
import { ISLAND_BASE_LAYERS, ISLAND_CENTER } from './islandBaseLayers';
import { vbEllipseRect, vbX, vbY, type ViewBoxLayout } from './viewBox';

interface IslandBaseProps {
  layout: ViewBoxLayout;
  scale: SharedValue<number>;
}

export function IslandBase({ layout, scale }: IslandBaseProps) {
  const transform = useDerivedValue(() => {
    const cx = vbX(ISLAND_CENTER.x, layout);
    const cy = vbY(ISLAND_CENTER.y, layout);
    return [
      { translateX: cx },
      { translateY: cy },
      { scale: scale.value },
      { translateX: -cx },
      { translateY: -cy },
    ];
  });

  return (
    <Group transform={transform}>
      {ISLAND_BASE_LAYERS.map((layer, index) => {
        const rect = vbEllipseRect(
          layer.cx,
          layer.cy,
          layer.rx,
          layer.ry,
          layout
        );
        return (
          <Oval
            key={`${layer.color}-${index}`}
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            color={layer.color}
            opacity={layer.opacity ?? 1}
          />
        );
      })}
    </Group>
  );
}
