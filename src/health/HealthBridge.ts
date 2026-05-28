import type { NormalizedHealthData } from './HealthNormalizer';

export interface HealthBridge {
  isAvailable(): Promise<boolean>;
  requestPermissions(): Promise<boolean>;
  fetchLast14Days(): Promise<NormalizedHealthData>;
}
