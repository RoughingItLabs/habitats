import { Platform } from 'react-native';
import type { HealthBridge } from './HealthBridge';
import { healthConnectBridge } from './HealthConnectBridge';
import { healthKitBridge } from './HealthKitBridge';

export function getHealthBridge(): HealthBridge {
  return Platform.OS === 'ios' ? healthKitBridge : healthConnectBridge;
}

export function getHealthPlatformLabel(): string {
  return Platform.OS === 'ios' ? 'Apple Health' : 'Health Connect';
}
