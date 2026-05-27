export type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 16) return 'morning';
  if (hour >= 16 && hour < 19) return 'afternoon';
  if (hour >= 19 && hour < 21) return 'evening';
  return 'night';
}

export function getTimeProgress(hour: number, minute: number): number {
  return (hour * 60 + minute) / 1440;
}

export function readDeviceTime(): { timeOfDay: TimeOfDay; timeProgress: number } {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  return {
    timeOfDay: getTimeOfDay(hour),
    timeProgress: getTimeProgress(hour, minute),
  };
}
