import 'dotenv/config';
export default {
  name: "Audacity Sign Up",
  slug: "audacity-music-club",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./src/assets/eternity-band.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./src/assets/eternity-band.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "org.eternityband.signup",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./src/assets/eternity-band.png",
      backgroundColor: "#ffffff",
    },
    package: "org.eternityband.signup",
  },
  web: {
    favicon: "./src/assets/eternity-band.png",
  },
  extra: {
    email: process.env.EXPO_PUBLIC_EMAIL,
    eas: {
      projectId: "56bb99cb-9cbe-423d-9a88-3f82a0cf3aa0",
    },
  },
  updates: {
    url: "https://u.expo.dev/56bb99cb-9cbe-423d-9a88-3f82a0cf3aa0",
  },
  runtimeVersion: "1.0.0",
  plugins: [],
  owner: "audacitymusic",
};