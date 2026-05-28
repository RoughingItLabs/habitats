import type { ExpoConfig } from 'expo/config';

// newArchEnabled is valid in Expo 56 but not yet reflected in the ExpoConfig type
const config: ExpoConfig & { newArchEnabled?: boolean } = {
  name: 'Habitats',
  slug: 'habitats',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'habitats',
  userInterfaceStyle: 'dark',
  newArchEnabled: true,
  ios: {
    bundleIdentifier: 'com.habitats.app',
    supportsTablet: true,
    infoPlist: {
      NSHealthShareUsageDescription:
        'Habitats reads your activity to grow your island world.',
      NSHealthUpdateUsageDescription: 'Habitats does not write health data.',
    },
  },
  android: {
    package: 'com.habitats.app',
    adaptiveIcon: {
      backgroundColor: '#1a1030',
    },
  },
  plugins: [
    'expo-router',
    'expo-font',
    'expo-health-connect',
    [
      'expo-build-properties',
      {
        android: {
          minSdkVersion: 26,
        },
      },
    ],
    [
      'react-native-health',
      {
        healthSharePermission:
          'Habitats reads your activity to grow your island world.',
        healthUpdatePermission: 'Habitats does not write health data.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
  },
};

export default config;
