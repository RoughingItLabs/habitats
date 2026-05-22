import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
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
    'expo-dev-client',
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
