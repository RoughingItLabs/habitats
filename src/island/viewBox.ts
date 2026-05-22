/** Normalized island coordinate system: 0–100 maps to the canvas. */
export const VIEWBOX_SIZE = 100;

export interface ViewBoxLayout {
  width: number;
  height: number;
}

export function vbX(x: number, layout: ViewBoxLayout): number {
  return (x / VIEWBOX_SIZE) * layout.width;
}

export function vbY(y: number, layout: ViewBoxLayout): number {
  return (y / VIEWBOX_SIZE) * layout.height;
}

export function vbW(w: number, layout: ViewBoxLayout): number {
  return (w / VIEWBOX_SIZE) * layout.width;
}

export function vbH(h: number, layout: ViewBoxLayout): number {
  return (h / VIEWBOX_SIZE) * layout.height;
}

/** Bounding rect for an ellipse defined in viewBox units (cx, cy, rx, ry). */
export function vbEllipseRect(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  layout: ViewBoxLayout
): { x: number; y: number; width: number; height: number } {
  return {
    x: vbX(cx - rx, layout),
    y: vbY(cy - ry, layout),
    width: vbW(rx * 2, layout),
    height: vbH(ry * 2, layout),
  };
}
