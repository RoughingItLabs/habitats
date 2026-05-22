/**
 * IslandCanvas.tsx
 * Root Skia canvas — renders everything.
 * TODO (Prompt 3): Implement full Skia rendering.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ZoneData, ZoneId } from '../types/zone';

interface IslandCanvasProps {
  zones: Partial<Record<ZoneId, ZoneData>>;
  islandScale: number;
  ambientText?: string; // Narration agent output
}

export function IslandCanvas({ zones, islandScale, ambientText }: IslandCanvasProps) {
  // TODO: Replace with @shopify/react-native-skia Canvas
  return <View style={styles.canvas} />;
}

const styles = StyleSheet.create({
  canvas: { flex: 1, backgroundColor: '#1a1030' },
});
