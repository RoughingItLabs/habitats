import {
  ISLAND_BASE_LAYERS,
  ISLAND_CENTER,
  type IslandEllipseLayer,
} from '../islandBaseLayers';

describe('islandBaseLayers', () => {
  it('defines eight layers from shadow through highlight', () => {
    expect(ISLAND_BASE_LAYERS).toHaveLength(8);
  });

  it('orders layers bottom to top by cy (shadow lowest on screen)', () => {
    const cyValues = ISLAND_BASE_LAYERS.map(l => l.cy);
    const shadow = cyValues[0]!;
    const highlight = cyValues[cyValues.length - 1]!;
    expect(shadow).toBeGreaterThan(highlight);
    expect(shadow).toBeGreaterThan(ISLAND_CENTER.y);
  });

  it('keeps layers horizontally centered on the island', () => {
    ISLAND_BASE_LAYERS.forEach(layer => {
      expect(Math.abs(layer.cx - ISLAND_CENTER.x)).toBeLessThanOrEqual(5);
    });
  });

  it('uses sand tones for beach rings and greens for land', () => {
    const beach = ISLAND_BASE_LAYERS.filter(l =>
      l.color.startsWith('#C') || l.color.startsWith('#D')
    );
    const land = ISLAND_BASE_LAYERS.filter(l =>
      l.color.startsWith('#4') ||
      l.color.startsWith('#5') ||
      l.color.startsWith('#6') ||
      l.color.startsWith('#8')
    );
    expect(beach.length).toBeGreaterThanOrEqual(2);
    expect(land.length).toBeGreaterThanOrEqual(3);
  });

  it('uses opacity only on shadow and highlight', () => {
    const withOpacity = ISLAND_BASE_LAYERS.filter(
      (l): l is IslandEllipseLayer & { opacity: number } => l.opacity != null
    );
    expect(withOpacity).toHaveLength(2);
    withOpacity.forEach(layer => {
      expect(layer.opacity).toBeGreaterThan(0);
      expect(layer.opacity).toBeLessThanOrEqual(1);
    });
  });

  it('places island center between highland and beach vertically', () => {
    const minCy = Math.min(...ISLAND_BASE_LAYERS.map(l => l.cy));
    const maxCy = Math.max(...ISLAND_BASE_LAYERS.map(l => l.cy));
    expect(ISLAND_CENTER.y).toBeGreaterThan(minCy);
    expect(ISLAND_CENTER.y).toBeLessThan(maxCy);
  });
});
