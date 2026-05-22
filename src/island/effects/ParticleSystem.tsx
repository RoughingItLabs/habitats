/**
 * ParticleSystem.tsx
 * Reusable particles — sparkles, embers, petals.
 * TODO: Implement with Skia + Reanimated.
 */
import React from 'react';

interface ParticleSystemProps {
  type: 'sparkle' | 'ember' | 'petal' | 'bubble';
  count: number;
  x: number;
  y: number;
  color: string;
}

export function ParticleSystem(_props: ParticleSystemProps) {
  return null;
}
