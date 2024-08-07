export default {
  name: "Audacity Music Club",
  slug: "audacity-music-club",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./src/assets/audacity-music-club.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./src/assets/audacity-music-club.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "org.eternityband.signup",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./src/assets/audacity-music-club.png",
      backgroundColor: "#ffffff",
    },
    package: "org.eternityband.signup",
  },
  web: {
    favicon: "./src/assets/audacity-music-club.png",
  },
  extra: {
    eas: {
      projectId: "56bb99cb-9cbe-423d-9a88-3f82a0cf3aa0",
    },
  },
  updates: {
    url: "https://u.expo.dev/56bb99cb-9cbe-423d-9a88-3f82a0cf3aa0",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  plugins: [
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_IOS_SCHEME,
      },
    ],
  ],
  owner: "audacitymusic",
};
