export const MIN_ISLAND_SCALE = 0.75;
export const MAX_ISLAND_SCALE = 1.1;

export function clampIslandScale(scale: number): number {
  return Math.min(Math.max(scale, MIN_ISLAND_SCALE), MAX_ISLAND_SCALE);
}
