import {
  MAX_ISLAND_SCALE,
  MIN_ISLAND_SCALE,
  clampIslandScale,
} from '../islandScale';

describe('clampIslandScale', () => {
  it('returns value unchanged when within range', () => {
    expect(clampIslandScale(0.9)).toBe(0.9);
    expect(clampIslandScale(MIN_ISLAND_SCALE)).toBe(MIN_ISLAND_SCALE);
    expect(clampIslandScale(MAX_ISLAND_SCALE)).toBe(MAX_ISLAND_SCALE);
  });

  it('clamps below minimum', () => {
    expect(clampIslandScale(0)).toBe(MIN_ISLAND_SCALE);
    expect(clampIslandScale(0.5)).toBe(MIN_ISLAND_SCALE);
  });

  it('clamps above maximum', () => {
    expect(clampIslandScale(1.5)).toBe(MAX_ISLAND_SCALE);
    expect(clampIslandScale(2)).toBe(MAX_ISLAND_SCALE);
  });
});
