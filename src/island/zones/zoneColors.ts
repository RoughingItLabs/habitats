/** Pure color + level helpers for Skia zone renderers (worklet-safe). */

export interface ZonePaletteInput {
  primary: string;
  mid: string;
  light: string;
  glow: string;
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  'worklet';
  if (edge0 === edge1) {
    return x >= edge1 ? 1 : 0;
  }
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** 0 below start, smooth ramp to 1 by end. */
export function zoneLayerOpacity(
  level: number,
  fadeInStart: number,
  fadeInEnd: number
): number {
  'worklet';
  if (level < fadeInStart) {
    return 0;
  }
  if (level >= fadeInEnd) {
    return 1;
  }
  return smoothstep(fadeInStart, fadeInEnd, level);
}

export function parseHex(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const channel = (n: number) =>
    Math.round(Math.min(255, Math.max(0, n)))
      .toString(16)
      .padStart(2, '0');
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

export function mixHex(a: string, b: string, t: number): string {
  const ca = parseHex(a);
  const cb = parseHex(b);
  return rgbToHex(
    ca.r + (cb.r - ca.r) * t,
    ca.g + (cb.g - ca.g) * t,
    ca.b + (cb.b - ca.b) * t
  );
}

/** amount 0–1: 0 unchanged, 1 fully grey. */
export function desaturateHex(hex: string, amount: number): string {
  const { r, g, b } = parseHex(hex);
  const gray = 0.299 * r + 0.587 * g + 0.114 * b;
  const keep = 1 - amount;
  return rgbToHex(
    r * keep + gray * amount,
    g * keep + gray * amount,
    b * keep + gray * amount
  );
}

export function tintHex(
  hex: string,
  tint: { r: number; g: number; b: number },
  strength: number
): string {
  const { r, g, b } = parseHex(hex);
  const keep = 1 - strength;
  return rgbToHex(
    r * keep + tint.r * strength,
    g * keep + tint.g * strength,
    b * keep + tint.b * strength
  );
}

const NEGLECT_GREY_GREEN = '#4a5a4a';

/** +amount brightness toward white (0.2 = 20% brighter). */
export function brightenHex(hex: string, amount: number): string {
  const { r, g, b } = parseHex(hex);
  return rgbToHex(
    r + (255 - r) * amount,
    g + (255 - g) * amount,
    b + (255 - b) * amount
  );
}

export function applyNeglectedColor(hex: string, isNeglected: boolean): string {
  if (!isNeglected) {
    return hex;
  }
  return mixHex(hex, NEGLECT_GREY_GREEN, 0.35);
}

export function applyThrivingColor(hex: string, isThriving: boolean): string {
  if (!isThriving) {
    return hex;
  }
  return brightenHex(hex, 0.2);
}

export function buildNeglectedPalette(
  colors: ZonePaletteInput,
  isNeglected: boolean
): ZonePaletteInput {
  return {
    primary: applyNeglectedColor(colors.primary, isNeglected),
    mid: applyNeglectedColor(colors.mid, isNeglected),
    light: applyNeglectedColor(colors.light, isNeglected),
    glow: applyNeglectedColor(colors.glow, isNeglected),
  };
}

export function buildZoneVisualPalette(
  colors: ZonePaletteInput,
  options: { isNeglected: boolean; isThriving: boolean }
): ZonePaletteInput {
  const base = buildNeglectedPalette(colors, options.isNeglected);
  if (!options.isThriving || options.isNeglected) {
    return base;
  }
  return {
    primary: applyThrivingColor(base.primary, true),
    mid: applyThrivingColor(base.mid, true),
    light: applyThrivingColor(base.light, true),
    glow: applyThrivingColor(base.glow, true),
  };
}

/** Stops for interpolateColor across seedling → growing → established. */
export function terrainColorStops(colors: ZonePaletteInput): [string, string, string] {
  return [
    mixHex(colors.primary, colors.mid, 0.35),
    mixHex(colors.mid, colors.light, 0.45),
    colors.light,
  ];
}

export function glowColorStops(colors: ZonePaletteInput): [string, string, string] {
  return [
    mixHex(colors.glow, colors.mid, 0.55),
    mixHex(colors.glow, colors.light, 0.35),
    colors.glow,
  ];
}
