import React, { useMemo } from 'react';
import { Group, Oval } from '@shopify/react-native-skia';
import type { ZoneDefinition } from '../../types/zone';
import { vbEllipseRect, type ViewBoxLayout } from '../viewBox';
import { buildNeglectOvergrowth } from './zoneOverlayLogic';

interface ZoneNeglectedOverlayProps {
  def: ZoneDefinition;
  layout: ViewBoxLayout;
  centerCx: number;
  centerCy: number;
  seed: number;
}

export function ZoneNeglectedOverlay({
  def,
  layout,
  centerCx,
  centerCy,
  seed,
}: ZoneNeglectedOverlayProps) {
  const patches = useMemo(
    () => buildNeglectOvergrowth(4, seed, def.baseSize.w, def.baseSize.h),
    [def.baseSize.w, def.baseSize.h, seed]
  );

  return (
    <Group>
      {patches.map((patch, index) => {
        const rect = vbEllipseRect(
          centerCx + patch.dx,
          centerCy + patch.dy,
          patch.rx,
          patch.ry,
          layout
        );
        return (
          <Oval
            key={`neglect-${index}`}
            {...rect}
            color="#2a3528"
            opacity={patch.opacity}
          />
        );
      })}
    </Group>
  );
}
