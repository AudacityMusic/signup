import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Image,
} from "react-native";

import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
} from "@react-native-google-signin/google-signin";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { alertError } from "../utils";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_WEB_ID, // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_IOS_ID, // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
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
        <Text style={styles.paragraph}>
          {"\n"}
          {"Thank you for choosing to help\n"}
          {"make our volunteer concerts a\n"}
          {"success! To begin, please sign\n"}
          {"in using your Google account.\n"}
        </Text>

        <Pressable
          style={[styles.OAuth, styles.GoogleOAuth]}
          onPress={async () => {
            console.log("Signing In...");
            try {
              await GoogleSignin.hasPlayServices();
              const userInfo = await GoogleSignin.signIn();
              AsyncStorage.setItem("user", JSON.stringify(userInfo.user));
              AsyncStorage.setItem(
                "access-token",
                (await GoogleSignin.getTokens()).accessToken,
              );
              navigation.navigate("Home", { shouldRefresh: true });
            } catch (error) {
              if (
                isErrorWithCode(error) &&
                error.code != statusCodes.SIGN_IN_CANCELLED
              ) {
                alertError(`While signing in: (${error.code}) ${error}`);
              } else {
                alertError(`While signing in: (no error code) ${error}`);
              }
            }
          }}
        >
          <Image
            style={styles.OAuthLogo}
            source={require("../assets/google.png")}
          />
          <Text style={[styles.OAuthText]}> Sign in with Google</Text>
        </Pressable>
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
  },

  OAuth: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 270,
    height: 50,
    borderRadius: 15,
  },

  OAuthLogo: {
    width: 40,
    height: 40,
  },

  OAuthText: {
    color: "#fff",
    fontSize: 20,
  },

  GoogleOAuth: {
    backgroundColor: "#353535",
    color: "#fff",
  },

  loading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },
});
