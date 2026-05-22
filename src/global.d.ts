/**
 * Global type declarations for Expo / Metro bundler environment.
 * process.env is injected at build time by Metro via Expo's babel transform.
 */
declare const process: {
  env: {
    EXPO_PUBLIC_SUPABASE_URL?: string;
    EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
    EXPO_PUBLIC_POSTHOG_KEY?: string;
    ANTHROPIC_API_KEY?: string;
    STRAVA_CLIENT_ID?: string;
    STRAVA_CLIENT_SECRET?: string;
    GARMIN_CLIENT_ID?: string;
    GARMIN_CLIENT_SECRET?: string;
    REVENUECAT_IOS_KEY?: string;
    REVENUECAT_ANDROID_KEY?: string;
    NODE_ENV?: 'development' | 'production' | 'test';
    [key: string]: string | undefined;
  };
};
