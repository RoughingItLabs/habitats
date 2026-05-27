import React, { useEffect, useMemo } from 'react';
import { Circle, Group, Oval } from '@shopify/react-native-skia';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { ZoneDefinition } from '../../types/zone';
import { vbW, vbX, vbY, type ViewBoxLayout } from '../viewBox';
import {
  buildThrivingParticles,
  type RisingParticleSeed,
} from './zoneOverlayLogic';

interface ZoneThrivingOverlayProps {
  def: ZoneDefinition;
  layout: ViewBoxLayout;
  centerCx: number;
  centerCy: number;
  seed: number;
}

function RisingParticle({
  particle,
  centerCx,
  centerCy,
  zoneH,
  layout,
  color,
}: {
  particle: RisingParticleSeed;
  centerCx: number;
  centerCy: number;
  zoneH: number;
  layout: ViewBoxLayout;
  color: string;
}) {
  const progress = useSharedValue(0);
  const startY = centerCy + particle.spawnY;
  const endY = centerCy - zoneH * 0.38;

  useEffect(() => {
    const run = () => {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: particle.durationMs,
        easing: Easing.out(Easing.quad),
      });
    };
    const startId = setTimeout(run, particle.delayMs);
    const loopId = setInterval(
      run,
      particle.durationMs + particle.delayMs + 200
    );
    return () => {
      clearTimeout(startId);
      clearInterval(loopId);
    };
  }, [particle, progress]);

  const cx = vbX(centerCx + particle.x, layout);
  const cy = useDerivedValue(() => {
    const y = startY + (endY - startY) * progress.value;
    return vbY(y, layout);
  });
  const opacity = useDerivedValue(() => 0.7 * (1 - progress.value));

  return (
    <Circle
      cx={cx}
      cy={cy}
      r={vbW(particle.r, layout)}
      color={color}
      opacity={opacity}
    />
  );
}

export function ZoneThrivingOverlay({
  def,
  layout,
  centerCx,
  centerCy,
  seed,
}: ZoneThrivingOverlayProps) {
  const particles = useMemo(
    () => buildThrivingParticles(5, seed, def.baseSize.w, def.baseSize.h),
    [def.baseSize.w, def.baseSize.h, seed]
  );

  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [pulse]);

  const ringOpacity = useDerivedValue(() => 0.2 + pulse.value * 0.3);
  const ringRx = vbW(def.baseSize.w * 0.48, layout);
  const ringRy = vbW(def.baseSize.h * 0.46, layout);
  const ringX = vbX(centerCx, layout) - ringRx;
  const ringY = vbY(centerCy, layout) - ringRy;

  return (
    <Group>
      <Oval
        x={ringX}
        y={ringY}
        width={ringRx * 2}
        height={ringRy * 2}
        color={def.colors.light}
        opacity={ringOpacity}
      />
      {particles.map((particle, index) => (
        <RisingParticle
          key={`thrive-p-${index}`}
          particle={particle}
          centerCx={centerCx}
          centerCy={centerCy}
          zoneH={def.baseSize.h}
          layout={layout}
          color={def.colors.light}
        />
      ))}
    </Group>
  );
}
