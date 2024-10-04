export default {
  name: "Audacity Music Club",
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
    usesAppleSignIn: true,
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
    email: "it@eternityband.org",
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
        iosUrlScheme:
          process.env.EXPO_PUBLIC_GOOGLE_OAUTH_IOS_SCHEME ??
          console.error(
            "Error: Undefined EXPO_PUBLIC_GOOGLE_OAUTH_IOS_SCHEME env variable",
          ),
      },
    ],
    "expo-apple-authentication",
  ],
  owner: "audacitymusic",
};
