/**
 * Moon Grove — sleep zone. Layered Skia art driven by animated level (0–1).
 */
import React, { useEffect } from 'react';
import {
  BlurMask,
  Circle,
  Group,
  Line,
  Oval,
  vec,
} from '@shopify/react-native-skia';
import {
  interpolateColor,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { ZONE_DEFINITIONS } from '../../constants/zones';
import type { ZoneData } from '../../types/zone';
import {
  vbEllipseRect,
  vbW,
  vbX,
  vbY,
  type ViewBoxLayout,
} from '../viewBox';
import {
  buildNeglectedPalette,
  glowColorStops,
  terrainColorStops,
} from './zoneColors';
import {
  MOON_GROVE_CENTER,
  MOON_GROVE_GLOW_RADIUS,
  MOON_GROVE_INNER_RADIUS,
  MOON_GROVE_LEVEL_COLOR_INPUT,
  MOON_GROVE_TERRAIN_RADIUS,
  moonGroveGlowOpacity,
  moonGroveLushOpacity,
  moonGroveTerrainOpacity,
  moonGroveTreesOpacity,
  moonGroveVisualLevel,
} from './moonGroveLogic';

const DEF = ZONE_DEFINITIONS.moongrove;

const TREES = [
  { cx: -5.5, canopyY: -3.5, canopyR: 2.6, trunkLen: 5.2 },
  { cx: 3.5, canopyY: -2, canopyR: 3, trunkLen: 5.8 },
  { cx: -1.5, canopyY: 1.5, canopyR: 2.2, trunkLen: 4.5 },
  { cx: 6.5, canopyY: 0.5, canopyR: 2.5, trunkLen: 5 },
] as const;

const PARTICLES = [
  { x: -3.5, y: -4, r: 0.45 },
  { x: 1, y: -5.5, r: 0.35 },
  { x: 4.5, y: -3, r: 0.4 },
  { x: -5, y: 0, r: 0.3 },
  { x: 2.5, y: 2, r: 0.38 },
  { x: 5, y: -1, r: 0.32 },
] as const;

export interface MoonGroveProps {
  zone: ZoneData;
  layout: ViewBoxLayout;
  animatedLevel: SharedValue<number>;
}

export function MoonGrove({ zone, layout, animatedLevel }: MoonGroveProps) {
  const colors = buildNeglectedPalette(DEF.colors, zone.isNeglected);
  const terrainStops = terrainColorStops(colors);
  const glowStops = glowColorStops(colors);
  const trunkColor = colors.primary;
  const canopyColor = colors.mid;

  const pulsePhase = useSharedValue(0);

  useEffect(() => {
    pulsePhase.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800 }),
        withTiming(0, { duration: 1800 })
      ),
      -1,
      false
    );
  }, [pulsePhase]);

  const visualLevel = useDerivedValue(() =>
    moonGroveVisualLevel(animatedLevel.value, zone.peakLevelEver)
  );

  const glowOpacity = useDerivedValue(() =>
    moonGroveGlowOpacity(visualLevel.value, pulsePhase.value)
  );

  const terrainOpacity = useDerivedValue(() =>
    moonGroveTerrainOpacity(visualLevel.value)
  );

  const treesOpacity = useDerivedValue(() =>
    moonGroveTreesOpacity(visualLevel.value)
  );

  const lushOpacity = useDerivedValue(() =>
    moonGroveLushOpacity(visualLevel.value)
  );

  const terrainColor = useDerivedValue(() =>
    interpolateColor(
      visualLevel.value,
      [...MOON_GROVE_LEVEL_COLOR_INPUT],
      terrainStops
    )
  );

  const outerGlowColor = useDerivedValue(() =>
    interpolateColor(
      visualLevel.value,
      [...MOON_GROVE_LEVEL_COLOR_INPUT],
      glowStops
    )
  );

  const glowRect = vbEllipseRect(
    MOON_GROVE_CENTER.cx,
    MOON_GROVE_CENTER.cy,
    MOON_GROVE_GLOW_RADIUS.rx,
    MOON_GROVE_GLOW_RADIUS.ry,
    layout
  );
  const terrainRect = vbEllipseRect(
    MOON_GROVE_CENTER.cx,
    MOON_GROVE_CENTER.cy,
    MOON_GROVE_TERRAIN_RADIUS.rx,
    MOON_GROVE_TERRAIN_RADIUS.ry,
    layout
  );
  const innerRect = vbEllipseRect(
    MOON_GROVE_CENTER.cx,
    MOON_GROVE_CENTER.cy,
    MOON_GROVE_INNER_RADIUS.rx,
    MOON_GROVE_INNER_RADIUS.ry,
    layout
  );

  return (
    <Group>
      <Oval
        {...glowRect}
        color={outerGlowColor}
        opacity={glowOpacity}
      >
        <BlurMask blur={10} style="normal" />
      </Oval>

      <Oval
        {...terrainRect}
        color={terrainColor}
        opacity={terrainOpacity}
      />

      <Group opacity={treesOpacity}>
        {TREES.map((tree, index) => {
          const canopyCx = vbX(MOON_GROVE_CENTER.cx + tree.cx, layout);
          const canopyCy = vbY(MOON_GROVE_CENTER.cy + tree.canopyY, layout);
          const canopyR = vbW(tree.canopyR, layout);
          const trunkBottom = vbY(
            MOON_GROVE_CENTER.cy + tree.canopyY + tree.trunkLen,
            layout
          );
          const stroke = Math.max(1.2, vbW(0.55, layout));

          return (
            <Group key={`tree-${index}`}>
              <Line
                p1={vec(canopyCx, canopyCy)}
                p2={vec(canopyCx, trunkBottom)}
                color={trunkColor}
                strokeWidth={stroke}
              />
              <Circle
                cx={canopyCx}
                cy={canopyCy}
                r={canopyR}
                color={canopyColor}
              />
            </Group>
          );
        })}
      </Group>

      <Oval
        {...innerRect}
        color={colors.glow}
        opacity={lushOpacity}
      >
        <BlurMask blur={6} style="normal" />
      </Oval>

      <Group opacity={lushOpacity}>
        {PARTICLES.map((particle, index) => (
          <Circle
            key={`particle-${index}`}
            cx={vbX(MOON_GROVE_CENTER.cx + particle.x, layout)}
            cy={vbY(MOON_GROVE_CENTER.cy + particle.y, layout)}
            r={vbW(particle.r, layout)}
            color={colors.glow}
            opacity={0.55 + (index % 3) * 0.15}
          />
        ))}
      </Group>
    </Group>
  );
}
