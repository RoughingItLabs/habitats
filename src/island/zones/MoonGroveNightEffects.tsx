import React, { useEffect, useMemo } from 'react';
import { Circle, Group } from '@shopify/react-native-skia';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { vbW, vbX, vbY, type ViewBoxLayout } from '../viewBox';
import {
  buildBioLights,
  buildOrbitParticles,
  type BioLightSeed,
  type OrbitParticleSeed,
} from './zoneOverlayLogic';

interface MoonGroveNightEffectsProps {
  layout: ViewBoxLayout;
  centerCx: number;
  centerCy: number;
  showBioluminescence: boolean;
  showOrbits: boolean;
  seed: number;
}

function BioLight({
  light,
  centerCx,
  centerCy,
  layout,
}: {
  light: BioLightSeed;
  centerCx: number;
  centerCy: number;
  layout: ViewBoxLayout;
}) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    const duration = light.minMs + (light.maxMs - light.minMs) * 0.5;
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [light, pulse]);

  const opacity = useDerivedValue(() => 0.3 + pulse.value * 0.5);

  return (
    <Circle
      cx={vbX(centerCx + light.dx, layout)}
      cy={vbY(centerCy + light.dy, layout)}
      r={vbW(light.r, layout)}
      color={light.color}
      opacity={opacity}
    />
  );
}

function OrbitParticle({
  orbit,
  centerCx,
  centerCy,
  layout,
}: {
  orbit: OrbitParticleSeed;
  centerCx: number;
  centerCy: number;
  layout: ViewBoxLayout;
}) {
  const angle = useSharedValue(orbit.phase);

  useEffect(() => {
    angle.value = withRepeat(
      withTiming(orbit.phase + Math.PI * 2, {
        duration: orbit.speedMs,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [angle, orbit]);

  const cx = useDerivedValue(
    () => vbX(centerCx + Math.cos(angle.value) * orbit.radius, layout)
  );
  const cy = useDerivedValue(
    () => vbY(centerCy + Math.sin(angle.value) * orbit.radius * 0.65, layout)
  );

  return (
    <Circle
      cx={cx}
      cy={cy}
      r={vbW(orbit.r, layout)}
      color="#E8D8FF"
      opacity={0.65}
    />
  );
}

export function MoonGroveNightEffects({
  layout,
  centerCx,
  centerCy,
  showBioluminescence,
  showOrbits,
  seed,
}: MoonGroveNightEffectsProps) {
  const bioLights = useMemo(
    () => buildBioLights(7, seed + 1, 28, 26),
    [seed]
  );
  const orbits = useMemo(
    () => buildOrbitParticles(3, seed + 2, 9),
    [seed]
  );

  if (!showBioluminescence && !showOrbits) {
    return null;
  }

  return (
    <Group>
      {showBioluminescence
        ? bioLights.map((light, index) => (
            <BioLight
              key={`bio-${index}`}
              light={light}
              centerCx={centerCx}
              centerCy={centerCy}
              layout={layout}
            />
          ))
        : null}
      {showOrbits
        ? orbits.map((orbit, index) => (
            <OrbitParticle
              key={`orbit-${index}`}
              orbit={orbit}
              centerCx={centerCx}
              centerCy={centerCy}
              layout={layout}
            />
          ))
        : null}
    </Group>
  );
}
