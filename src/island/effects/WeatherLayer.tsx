/**
 * WeatherLayer — health-driven atmospheric overlays above sky, below zones.
 */
import React, { useEffect, useMemo } from 'react';
import {
  Group,
  Line,
  Oval,
  Path,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ZONE_DEFINITIONS } from '../../constants/zones';
import type { ZoneData, ZoneId } from '../../types/zone';
import { useIslandStore } from '../../store/islandStore';
import { createSeededRandom } from './skyLayerLogic';
import { vbEllipseRect, type ViewBoxLayout } from '../viewBox';

interface WeatherLayerProps {
  layout: ViewBoxLayout;
  zones: Partial<Record<ZoneId, ZoneData>>;
}

interface RainDrop {
  x: number;
  y: number;
  length: number;
  delayMs: number;
  durationMs: number;
}

const RAIN_SEED = 55_555;
const RAIN_COUNT = 45;
const AURORA_COLORS = ['#C4B5D9', '#7A6AAA', '#A8D4E6'] as const;

function buildRainDrops(
  zoneRects: Array<{ x: number; y: number; width: number; height: number }>,
  count: number,
  seed: number
): RainDrop[] {
  if (zoneRects.length === 0) {
    return [];
  }
  const rng = createSeededRandom(seed);
  const drops: RainDrop[] = [];
  for (let i = 0; i < count; i++) {
    const rect = zoneRects[Math.floor(rng() * zoneRects.length)]!;
    drops.push({
      x: rect.x + rng() * rect.width,
      y: rect.y + rng() * rect.height * 0.4,
      length: 8 + rng() * 4,
      delayMs: rng() * 1500,
      durationMs: 1500 + rng() * 500,
    });
  }
  return drops;
}

function GoldenLightShaft({
  x,
  height,
  index,
}: {
  x: number;
  height: number;
  index: number;
}) {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    const duration = 4000 + index * 500;
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.2, { duration, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [index, opacity]);

  const shaftHeight = height * 0.45;
  const shaftWidth = height * 0.06;
  const path = useMemo(() => {
    const p = Skia.Path.Make();
    const topY = height * 0.05;
    const bottomY = topY + shaftHeight;
    const skew = shaftWidth * 0.35;
    p.moveTo(x, topY);
    p.lineTo(x + shaftWidth + skew, topY);
    p.lineTo(x + shaftWidth - skew, bottomY);
    p.lineTo(x - skew, bottomY);
    p.close();
    return p;
  }, [height, shaftHeight, shaftWidth, x]);

  return <Path path={path} color="#FFD16630" opacity={opacity} />;
}

function RainLine({
  drop,
  zoneRects,
}: {
  drop: RainDrop;
  zoneRects: Array<{ x: number; y: number; width: number; height: number }>;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    const tick = () => {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: drop.durationMs,
        easing: Easing.linear,
      });
    };
    const startId = setTimeout(tick, drop.delayMs);
    const loopId = setInterval(tick, drop.durationMs + drop.delayMs);
    return () => {
      clearTimeout(startId);
      clearInterval(loopId);
    };
  }, [drop, progress]);

  const p1 = useDerivedValue(() => {
    const fall = drop.length * progress.value;
    return vec(drop.x, drop.y + fall);
  });
  const p2 = useDerivedValue(() => {
    const fall = drop.length * progress.value;
    return vec(drop.x + 2, drop.y + fall - drop.length);
  });

  return (
    <Line
      p1={p1}
      p2={p2}
      color="#A8D4E640"
      strokeWidth={1}
    />
  );
}

function AuroraWave({
  width,
  height,
  index,
}: {
  width: number;
  height: number;
  index: number;
}) {
  const shift = useSharedValue(0);
  const colorIndex = useSharedValue(0);

  useEffect(() => {
    shift.value = withRepeat(
      withTiming(1, { duration: 12000 + index * 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    colorIndex.value = withRepeat(
      withTiming(AURORA_COLORS.length, { duration: 9000 }),
      -1,
      false
    );
  }, [colorIndex, index, shift]);

  // Static base path built on the JS thread — avoids Skia.Path.Make() in worklets.
  const basePath = useMemo(() => {
    const p = Skia.Path.Make();
    const baseX = width * (0.15 + index * 0.22);
    const top = height * 0.08;
    p.moveTo(baseX, top);
    p.quadTo(baseX + width * 0.06, height * 0.22, baseX - width * 0.02, height * 0.38);
    p.quadTo(baseX + width * 0.08, height * 0.28, baseX + width * 0.04, top);
    p.close();
    return p;
  }, [height, index, width]);

  // Wave motion applied as horizontal translateX so the path stays static.
  const waveTransform = useDerivedValue(() => [
    { translateX: Math.sin(shift.value * Math.PI * 2) * width * 0.04 },
  ]);

  const color = useDerivedValue(() => {
    const idx = Math.floor(colorIndex.value) % AURORA_COLORS.length;
    return AURORA_COLORS[idx] ?? AURORA_COLORS[0];
  });

  return (
    <Group transform={waveTransform}>
      <Path path={basePath} color={color} opacity={0.35} />
    </Group>
  );
}

function MorningMist({ width, height }: { width: number; height: number }) {
  const drift = useSharedValue(0);
  const mistOpacity = useSharedValue(0.12);

  useEffect(() => {
    drift.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 14000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 14000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [drift]);

  const mist1X = useDerivedValue(
    () => -width * 0.1 + drift.value * width * 0.15
  );
  const mist2X = useDerivedValue(
    () => width * 0.25 + drift.value * width * 0.12
  );

  return (
    <Group opacity={mistOpacity}>
      <Oval
        x={mist1X}
        y={height * 0.62}
        width={width * 0.55}
        height={height * 0.18}
        color="#FFFFFF18"
      />
      <Oval
        x={mist2X}
        y={height * 0.68}
        width={width * 0.5}
        height={height * 0.14}
        color="#FFFFFF14"
      />
    </Group>
  );
}

export function WeatherLayer({ layout, zones }: WeatherLayerProps) {
  const weather = useIslandStore(state => state.weather);
  const timeOfDay = useIslandStore(state => state.timeOfDay);
  const { width, height } = layout;

  const neglectedZoneRects = useMemo(() => {
    return Object.entries(zones)
      .filter(([, zone]) => zone?.isNeglected)
      .map(([id]) => {
        const def = ZONE_DEFINITIONS[id as ZoneId];
        return vbEllipseRect(
          def.basePosition.x + def.baseSize.w / 2,
          def.basePosition.y + def.baseSize.h / 2,
          def.baseSize.w * 0.5,
          def.baseSize.h * 0.5,
          layout
        );
      });
  }, [layout, zones]);

  const rainDrops = useMemo(
    () => buildRainDrops(neglectedZoneRects, RAIN_COUNT, RAIN_SEED),
    [neglectedZoneRects]
  );

  if (weather === 'clear') {
    return null;
  }

  return (
    <Group>
      {weather === 'golden_light'
        ? [0, 1, 2, 3].map(index => (
            <GoldenLightShaft
              key={`gold-${index}`}
              x={width * (0.2 + index * 0.18)}
              height={height}
              index={index}
            />
          ))
        : null}

      {weather === 'soft_rain'
        ? rainDrops.map((drop, index) => (
            <RainLine
              key={`rain-${index}`}
              drop={drop}
              zoneRects={neglectedZoneRects}
            />
          ))
        : null}

      {weather === 'morning_mist' && timeOfDay === 'dawn' ? (
        <MorningMist width={width} height={height} />
      ) : null}

      {weather === 'aurora'
        ? [0, 1, 2, 3].map(index => (
            <AuroraWave
              key={`aurora-${index}`}
              width={width}
              height={height}
              index={index}
            />
          ))
        : null}
    </Group>
  );
}
