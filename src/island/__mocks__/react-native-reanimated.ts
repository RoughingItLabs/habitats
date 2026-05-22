/** Jest stub — Reanimated is native-only. */
export const Easing = {
  linear: (t: number) => t,
  inOut: (e: (t: number) => number) => e,
  quad: (t: number) => t,
};

export function useSharedValue<T>(initial: T) {
  return { value: initial };
}

export function useDerivedValue<T>(fn: () => T) {
  return { value: fn() };
}

export function useFrameCallback() {
  return null;
}

export function withTiming<T>(to: T) {
  return to;
}

export function withRepeat<T>(val: T) {
  return val;
}

export function withSequence<T>(...vals: T[]) {
  return vals[vals.length - 1];
}

export function runOnJS<T extends (...args: unknown[]) => unknown>(fn: T) {
  return fn;
}

export function interpolateColor(
  _value: number,
  _input: number[],
  output: string[]
) {
  return output[output.length - 1] ?? '#000000';
}
