/**
 * SignInScreen.js
 * Handles user authentication via Google and Apple sign-in.
 * - Configures GoogleSignin on load
 * - Provides buttons for Google and Apple login
 * - Stores user info and access token in AsyncStorage
 */

import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as AppleAuth from "expo-apple-authentication";

import { alertError } from "../utils";
import {
  EXPO_PUBLIC_GOOGLE_OAUTH_WEB_ID,
  EXPO_PUBLIC_GOOGLE_OAUTH_IOS_ID,
} from "@env";

// Initialize Google Sign-In configuration
console.log("Environment variables:", {
  EXPO_PUBLIC_GOOGLE_OAUTH_WEB_ID,
  EXPO_PUBLIC_GOOGLE_OAUTH_IOS_ID,
});

GoogleSignin.configure({
  webClientId:
    EXPO_PUBLIC_GOOGLE_OAUTH_WEB_ID ||
    "761199370622-hsdvg6i6irb8d86aa6bjvbqgkjh3jhmh.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  iosClientId:
    EXPO_PUBLIC_GOOGLE_OAUTH_IOS_ID ||
    "761199370622-m8mpb5eihd5fbn76gk4lolcttcdm1f6k.apps.googleusercontent.com", // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  scopes: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/drive.file",
    "openid",
  ],
  offlineAccess: true,
});

export default function SignInScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        {/* Introductory text */}
        <Text style={styles.paragraph} selectable>
          Thank you for choosing to help make our volunteer opportunities and
          concerts across the Bay Area a success! To begin, please sign in.
        </Text>

        {/* Google Sign-In button */}
        <Pressable
          style={[styles.OAuth, styles.GoogleOAuth]}
          onPress={async () => {
            try {
              await GoogleSignin.hasPlayServices();
              const userInfo = await GoogleSignin.signIn();
              // Save user profile and access token
              await AsyncStorage.setItem("user", JSON.stringify(userInfo.user));
              await AsyncStorage.setItem(
                "access-token",
                (await GoogleSignin.getTokens()).accessToken,
              );
              navigation.navigate("Home", { forceRerender: true });
            } catch (error) {
              // Handle known Google sign-in errors
              if (isErrorWithCode(error)) {
                if (error.code == statusCodes.SIGN_IN_CANCELLED) {
                  return;
                }
                alertError(
                  `While signing in with Google: (${error.code}) ${error}`,
                );
              } else {
                alertError(
                  `While signing in with Google: (no error code) ${error}`,
                );
              }
            }
          }}
        >
          {/* Google logo and label */}
          <Image
            style={styles.OAuthLogo}
            source={require("../assets/google.png")}
          />
          <Text style={[styles.OAuthText]} selectable={true}>
            {" "}
            Sign in with Google
          </Text>
        </Pressable>

        {/* Apple Sign-In button, shown only if available */}
        {AppleAuth.isAvailableAsync() ? (
          <AppleAuth.AppleAuthenticationButton
            buttonType={AppleAuth.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuth.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={5}
            style={styles.OAuth}
            onPress={async () => {
              try {
                const credential = await AppleAuth.signInAsync({
                  requestedScopes: [
                    AppleAuth.AppleAuthenticationScope.FULL_NAME,
                    AppleAuth.AppleAuthenticationScope.EMAIL,
                  ],
                });

                // Check if we have existing Apple user data
                let existingAppleUser = null;
                try {
                  const appleUserData =
                    await AsyncStorage.getItem("apple-user-data");
                  if (appleUserData) {
                    existingAppleUser = JSON.parse(appleUserData);
                    console.log(
                      "🍎 Found existing Apple user data:",
                      existingAppleUser,
                    );
                  } else {
                    console.log("🍎 No existing Apple user data found");
                  }
                } catch (error) {
                  console.log(
                    "🍎 Error retrieving existing Apple user data:",
                    error,
                  );
                }

                // Extract name and email from credential (only available on first sign-in)
                let userName = "";
                let userEmail = "";

                console.log("🍎 Apple credential received:", {
                  hasFullName: !!credential.fullName,
                  hasEmail: !!credential.email,
                  givenName: credential.fullName?.givenName,
                  familyName: credential.fullName?.familyName,
                  email: credential.email,
                  user: credential.user,
                });

                if (
                  credential.fullName &&
                  (credential.fullName.givenName ||
                    credential.fullName.familyName)
                ) {
                  // First sign-in: Apple provides full name
                  const firstName = credential.fullName.givenName || "";
                  const lastName = credential.fullName.familyName || "";
                  userName = `${firstName} ${lastName}`.trim();
                  console.log("🍎 Using name from Apple credential:", userName);
                } else if (existingAppleUser && existingAppleUser.name) {
                  // Subsequent sign-ins: use stored name
                  userName = existingAppleUser.name;
                  console.log("🍎 Using stored name:", userName);
                }

                if (credential.email) {
                  // First sign-in: Apple provides email
                  userEmail = credential.email;
                  console.log(
                    "🍎 Using email from Apple credential:",
                    userEmail,
                  );
                } else if (existingAppleUser && existingAppleUser.email) {
                  // Subsequent sign-ins: use stored email
                  userEmail = existingAppleUser.email;
                  console.log("🍎 Using stored email:", userEmail);
                }

                // Create user object
                const userObject = {
                  name: userName,
                  email: userEmail,
                  id: credential.user || "apple",
                  provider: "apple",
                  appleUserId: credential.user,
                };

                console.log("🍎 Final user object:", userObject);

                // Store user data for app usage
                await AsyncStorage.setItem("user", JSON.stringify(userObject));

                // Persistently store Apple-specific data for future sign-ins
                // This data is stored separately to preserve it across app sessions
                if (userName || userEmail) {
                  const appleUserData = {
                    name: userName,
                    email: userEmail,
                    appleUserId: credential.user,
                    lastUpdated: new Date().toISOString(),
                  };
                  await AsyncStorage.setItem(
                    "apple-user-data",
                    JSON.stringify(appleUserData),
                  );
                  console.log("🍎 Stored Apple user data:", appleUserData);
                } else {
                  console.log(
                    "🍎 No data to store - userName and userEmail are empty",
                  );
                }

                await AsyncStorage.removeItem("access-token");
                navigation.navigate("Home", { forceRerender: true });
              } catch (error) {
                if (error.code != "ERR_REQUEST_CANCELED") {
                  alertError(
                    `While signing in with Apple: (${error.code}) ${error}`,
                  );
                }
              }
            }}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: "1%",
    height: "100%",
  },

  body: {
    alignItems: "center",
    justifyContent: "center",
  },

  paragraph: {
    fontSize: 18,
    padding: 20,
  },

  OAuth: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 270,
    height: 50,
    borderRadius: 5,
    margin: 5,
  },

  OAuthLogo: {
    width: 30,
    height: 30,
  },

  OAuthText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 600,
  },

  GoogleOAuth: {
    backgroundColor: "#000",
    color: "#fff",
  },

  loading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },
});
