/** Seeded pseudo-random (deterministic star field). */
export function createSeededRandom(seed: number): () => number {
  let state = seed % 233280;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

export interface StarSeed {
  x: number;
  y: number;
  r: number;
  twinkleMinMs: number;
  twinkleMaxMs: number;
  phaseOffset: number;
}

export const STAR_COUNT = 30;
export const STAR_FIELD_SEED = 42_069;

export function buildStarField(
  count: number,
  seed: number,
  width: number,
  height: number
): StarSeed[] {
  const rng = createSeededRandom(seed);
  const stars: StarSeed[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rng() * width,
      y: rng() * height * 0.55,
      r: 0.6 + rng() * 1.2,
      twinkleMinMs: 2000 + rng() * 1000,
      twinkleMaxMs: 3000 + rng() * 1000,
      phaseOffset: rng(),
    });
  }
  return stars;
}

export interface OceanShimmerSeed {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  driftMinPx: number;
  driftMaxPx: number;
  durationMs: number;
}

export const OCEAN_SHIMMER_COUNT = 4;
export const OCEAN_SHIMMER_SEED = 77_777;

export function buildOceanShimmers(
  count: number,
  seed: number,
  width: number,
  height: number
): OceanShimmerSeed[] {
  const rng = createSeededRandom(seed);
  const oceanTop = height * 0.72;
  const shimmers: OceanShimmerSeed[] = [];
  for (let i = 0; i < count; i++) {
    shimmers.push({
      cx: rng() * width,
      cy: oceanTop + rng() * (height - oceanTop) * 0.5,
      rx: width * (0.08 + rng() * 0.12),
      ry: 2 + rng() * 3,
      driftMinPx: 8 + rng() * 6,
      driftMaxPx: 18 + rng() * 10,
      durationMs: 6000 + rng() * 4000,
    });
  }
  return shimmers;
}
