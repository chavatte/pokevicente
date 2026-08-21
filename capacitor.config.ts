import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.pokevicente.app",
  appName: "pokevicente",
  webDir: "dist",
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: "#020617",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};
export default config;
