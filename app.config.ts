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
