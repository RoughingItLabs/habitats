import {
  VIEWBOX_SIZE,
  vbEllipseRect,
  vbH,
  vbW,
  vbX,
  vbY,
  type ViewBoxLayout,
} from '../viewBox';

const SQUARE: ViewBoxLayout = { width: 400, height: 400 };
const WIDE: ViewBoxLayout = { width: 400, height: 800 };

describe('viewBox', () => {
  describe('vbX / vbY', () => {
    it('maps viewBox origin to pixel origin', () => {
      expect(vbX(0, SQUARE)).toBe(0);
      expect(vbY(0, SQUARE)).toBe(0);
    });

    it('maps viewBox max to full width and height', () => {
      expect(vbX(VIEWBOX_SIZE, SQUARE)).toBe(400);
      expect(vbY(VIEWBOX_SIZE, SQUARE)).toBe(400);
    });

    it('maps center of viewBox to center of layout', () => {
      expect(vbX(50, SQUARE)).toBe(200);
      expect(vbY(50, SQUARE)).toBe(200);
    });

    it('scales x and y independently on non-square layouts', () => {
      expect(vbX(50, WIDE)).toBe(200);
      expect(vbY(50, WIDE)).toBe(400);
    });
  });

  describe('vbW / vbH', () => {
    it('converts viewBox width and height to pixels', () => {
      expect(vbW(100, SQUARE)).toBe(400);
      expect(vbH(50, SQUARE)).toBe(200);
      expect(vbH(50, WIDE)).toBe(400);
    });
  });

  describe('vbEllipseRect', () => {
    it('returns bounding rect for an ellipse in viewBox units', () => {
      const rect = vbEllipseRect(50, 58, 44, 15, SQUARE);
      expect(rect).toEqual({
        x: 24,
        y: 172,
        width: 352,
        height: 120,
      });
    });

    it('places ellipse center at converted cx/cy', () => {
      const rect = vbEllipseRect(50, 58, 20, 10, SQUARE);
      expect(rect.x + rect.width / 2).toBeCloseTo(vbX(50, SQUARE), 5);
      expect(rect.y + rect.height / 2).toBeCloseTo(vbY(58, SQUARE), 5);
    });

    it('stretches vertical radius more on tall layouts', () => {
      const square = vbEllipseRect(50, 50, 10, 20, SQUARE);
      const wide = vbEllipseRect(50, 50, 10, 20, WIDE);
      expect(wide.height).toBeGreaterThan(square.height);
      expect(wide.width).toBe(square.width);
    });
  });
});
