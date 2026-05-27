/** Jest stub — Skia is native-only. */
export const Canvas = () => null;
export const Circle = () => null;
export const Fill = () => null;
export const Group = () => null;
export const Line = () => null;
export const LinearGradient = () => null;
export const Oval = () => null;
export const BlurMask = () => null;
export const Path = () => null;
export const Text = () => null;
export const DashPathEffect = () => null;
export const Skia = { Path: { Make: () => ({ addOval: () => undefined, moveTo: () => undefined, lineTo: () => undefined, close: () => undefined, quadTo: () => undefined }) } };
export const vec = (x: number, y: number) => ({ x, y });
export const matchFont = () => ({});
