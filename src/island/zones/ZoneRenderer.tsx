/**
 * ZoneRenderer.tsx
 * Dispatches to zone-specific Skia art components.
 */
import React from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type { ZoneData } from '../../types/zone';
import type { ViewBoxLayout } from '../viewBox';
import { MoonGrove } from './MoonGrove';
import { resolveZoneRenderer } from './zoneRendererDispatch';

export interface ZoneRendererProps {
  zone: ZoneData;
  layout: ViewBoxLayout;
  /** Animated 0–1 level — drives growth transitions (2000ms). */
  animatedLevel: SharedValue<number>;
}

export function ZoneRenderer({ zone, layout, animatedLevel }: ZoneRendererProps) {
  const renderer = resolveZoneRenderer(zone.id);

  if (renderer === 'moongrove') {
    return (
      <MoonGrove
        zone={zone}
        layout={layout}
        animatedLevel={animatedLevel}
      />
    );
  }

  return null;
}
