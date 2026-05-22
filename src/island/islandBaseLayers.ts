/** Island landmass layers in viewBox coordinates (see viewBox.ts). */
export const ISLAND_CENTER = { x: 50, y: 58 } as const;

export interface IslandEllipseLayer {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  color: string;
  opacity?: number;
}

/** Bottom → top draw order. */
export const ISLAND_BASE_LAYERS: IslandEllipseLayer[] = [
  {
    cx: 50,
    cy: 70,
    rx: 40,
    ry: 7,
    color: '#08041a',
    opacity: 0.45,
  },
  {
    cx: 50,
    cy: 63,
    rx: 44,
    ry: 15,
    color: '#C9A87A',
  },
  {
    cx: 50,
    cy: 58,
    rx: 44,
    ry: 15,
    color: '#D4B896',
  },
  {
    cx: 50,
    cy: 56,
    rx: 34,
    ry: 21,
    color: '#4A7050',
  },
  {
    cx: 50,
    cy: 54,
    rx: 34,
    ry: 21,
    color: '#5A8A58',
  },
  {
    cx: 50,
    cy: 47,
    rx: 23,
    ry: 17,
    color: '#3A5A40',
  },
  {
    cx: 50,
    cy: 45,
    rx: 23,
    ry: 17,
    color: '#6AAA68',
  },
  {
    cx: 47,
    cy: 43,
    rx: 9,
    ry: 6,
    color: '#8AC488',
    opacity: 0.35,
  },
];
