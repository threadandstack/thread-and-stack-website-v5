import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7b399066f3c44da283576d955f5005a0',
  appName: 'Brain',
  webDir: 'dist',
  server: {
    url: 'https://7b399066-f3c4-4da2-8357-6d955f5005a0.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  ios: {
    contentInset: 'always',
  },
};

export default config;
