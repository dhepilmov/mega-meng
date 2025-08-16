import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.launcher',
  appName: 'Launcher App',
  webDir: 'build',
  server: {
    // Allow clear text traffic for local development
    cleartext: true,
    // Optional: Configure localhost for development
    // url: 'http://localhost:3000',
    // hostname: 'localhost'
  },
  android: {
    // Allow mixed content (http + https)
    allowMixedContent: true,
    // Capture back button
    captureInput: true,
    // Web security settings
    webContentsDebuggingEnabled: true
  },
  plugins: {
    // Configure plugins as needed
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      showSpinner: false
    },
    // Add more plugin configurations as needed
  }
};

export default config;
