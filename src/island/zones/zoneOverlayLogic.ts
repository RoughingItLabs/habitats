import { createSeededRandom } from '../effects/skyLayerLogic';

export interface OverlayEllipse {
  dx: number;
  dy: number;
  rx: number;
  ry: number;
  opacity: number;
}

export interface RisingParticleSeed {
  x: number;
  spawnY: number;
  r: number;
  durationMs: number;
  delayMs: number;
}

export function buildNeglectOvergrowth(
  count: number,
  seed: number,
  zoneW: number,
  zoneH: number
): OverlayEllipse[] {
  const rng = createSeededRandom(seed);
  const patches: OverlayEllipse[] = [];
  for (let i = 0; i < count; i++) {
    patches.push({
      dx: (rng() - 0.5) * zoneW * 0.7,
      dy: (rng() - 0.5) * zoneH * 0.65,
      rx: zoneW * (0.06 + rng() * 0.05),
      ry: zoneH * (0.05 + rng() * 0.04),
      opacity: 0.15,
    });
  }
  return patches;
}

export function buildThrivingParticles(
  count: number,
  seed: number,
  zoneW: number,
  zoneH: number
): RisingParticleSeed[] {
  const rng = createSeededRandom(seed);
  const particles: RisingParticleSeed[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: (rng() - 0.5) * zoneW * 0.75,
      spawnY: zoneH * (0.15 + rng() * 0.35),
      r: 0.35 + rng() * 0.35,
      durationMs: 3000 + rng() * 1000,
      delayMs: rng() * 2000,
    });
  }
  return particles;
}

export const BIO_COLORS = ['#C4B5D9', '#E8D8FF', '#A898C8'] as const;

export interface BioLightSeed {
  dx: number;
  dy: number;
  r: number;
  color: string;
  minMs: number;
  maxMs: number;
}

export function buildBioLights(
  count: number,
  seed: number,
  zoneW: number,
  zoneH: number
): BioLightSeed[] {
  const rng = createSeededRandom(seed);
  const lights: BioLightSeed[] = [];
  for (let i = 0; i < count; i++) {
    lights.push({
      dx: (rng() - 0.5) * zoneW * 0.8,
      dy: (rng() - 0.5) * zoneH * 0.75,
      r: 0.5 + rng() * 0.7,
      color: BIO_COLORS[Math.floor(rng() * BIO_COLORS.length)] ?? '#C4B5D9',
      minMs: 1500 + rng() * 800,
      maxMs: 2200 + rng() * 800,
    });
  }
  return lights;
}

export interface OrbitParticleSeed {
  radius: number;
  speedMs: number;
  phase: number;
  r: number;
}

export function buildOrbitParticles(
  count: number,
  seed: number,
  baseRadius: number
): OrbitParticleSeed[] {
  const rng = createSeededRandom(seed);
  const orbits: OrbitParticleSeed[] = [];
  for (let i = 0; i < count; i++) {
    orbits.push({
      radius: baseRadius * (0.55 + rng() * 0.45),
      speedMs: 8000 + rng() * 6000,
      phase: rng() * Math.PI * 2,
      r: 0.4 + rng() * 0.25,
    });
  }
  return orbits;
}
