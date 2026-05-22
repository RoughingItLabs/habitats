/**
 * ZoneRenderer.tsx
 * Per-zone Skia art. Prompt 4+ will implement visuals; wired here for level animation.
 */
import React from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type { ZoneData } from '../../types/zone';
import type { ViewBoxLayout } from '../viewBox';

export interface ZoneRendererProps {
  zone: ZoneData;
  layout: ViewBoxLayout;
  /** Animated 0–1 level — drives future growth transitions (Prompt 4). */
  animatedLevel: SharedValue<number>;
}

export function ZoneRenderer(_props: ZoneRendererProps) {
  return null;
}
