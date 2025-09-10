import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d2d40c92c87c45459830cf82233ea38e',
  appName: 'easy-drink-recipes',
  webDir: 'dist',
  server: {
    url: 'https://d2d40c92-c87c-4545-9830-cf82233ea38e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;