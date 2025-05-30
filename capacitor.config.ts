
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ca25320dd8f4442d8fad2b45e839f57a',
  appName: 'quanta-vault-keeper',
  webDir: 'dist',
  // server: {
  //   url: 'https://ca25320d-d8f4-442d-8fad-2b45e839f57a.lovableproject.com?forceHideBadge=true',
  //   cleartext: true
  // },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e3a8a',
      showSpinner: false
    }
  }
};

export default config;
