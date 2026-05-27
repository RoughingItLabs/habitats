/**
 * Shimmer state — glow only, dashed rotating border, hint text.
 */
import React, { useEffect, useMemo } from 'react';
import {
  DashPathEffect,
  Group,
  Oval,
  Path,
  Skia,
  Text as SkiaText,
  matchFont,
} from '@shopify/react-native-skia';
import { Platform } from 'react-native';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { ZoneDefinition } from '../../types/zone';
import { vbEllipseRect, vbW, vbX, vbY, type ViewBoxLayout } from '../viewBox';

export interface ZoneShimmerProps {
  def: ZoneDefinition;
  layout: ViewBoxLayout;
}

export function ZoneShimmer({ def, layout }: ZoneShimmerProps) {
  const centerCx = def.basePosition.x + def.baseSize.w / 2;
  const centerCy = def.basePosition.y + def.baseSize.h / 2;
  const glowRect = vbEllipseRect(
    centerCx,
    centerCy,
    def.baseSize.w * 0.42,
    def.baseSize.h * 0.4,
    layout
  );
  const borderRect = vbEllipseRect(
    centerCx,
    centerCy,
    def.baseSize.w * 0.44,
    def.baseSize.h * 0.42,
    layout
  );

  const pulse = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    rotation.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 12000, easing: Easing.linear }),
      -1,
      false
    );
  }, [pulse, rotation]);

  const glowOpacity = useDerivedValue(() => 0.06 + pulse.value * 0.12);
  const glowColor = `${def.colors.light}26`;

  const borderPath = useMemo(() => {
    const path = Skia.Path.Make();
    path.addOval({
      x: borderRect.x,
      y: borderRect.y,
      width: borderRect.width,
      height: borderRect.height,
    });
    return path;
  }, [borderRect.height, borderRect.width, borderRect.x, borderRect.y]);

  const borderTransform = useDerivedValue(() => {
    const cx = borderRect.x + borderRect.width / 2;
    const cy = borderRect.y + borderRect.height / 2;
    return [
      { translateX: cx },
      { translateY: cy },
      { rotate: rotation.value },
      { translateX: -cx },
      { translateY: -cy },
    ];
  });

  const font = useMemo(
    () =>
      matchFont({
        fontFamily: Platform.select({ ios: 'Helvetica', default: 'sans-serif' }),
        fontSize: 11,
        fontStyle: 'italic',
      }),
    []
  );
  const labelY = vbY(centerCy + def.baseSize.h * 0.32, layout);
  const labelX = vbX(centerCx, layout) - 42;

  return (
    <Group>
      <Oval {...glowRect} color={glowColor} opacity={glowOpacity} />
      <Group transform={borderTransform}>
        <Path
          path={borderPath}
          style="stroke"
          strokeWidth={1}
          color={def.colors.light}
          opacity={0.35}
        >
          <DashPathEffect intervals={[4, 6]} />
        </Path>
      </Group>
      <SkiaText
        x={labelX}
        y={labelY}
        text="something stirs..."
        font={font}
        color={def.colors.light}
        opacity={0.45}
      />
    </Group>
  );
}
