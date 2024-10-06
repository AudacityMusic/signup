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

GoogleSignin.configure({
  webClientId:
    process.env.EXPO_PUBLIC_GOOGLE_OAUTH_WEB_ID ??
    alertError("Undefined EXPO_PUBLIC_GOOGLE_OAUTH_WEB_ID env variable"), // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  iosClientId:
    process.env.EXPO_PUBLIC_GOOGLE_OAUTH_IOS_ID ??
    alertError("Undefined EXPO_PUBLIC_GOOGLE_OAUTH_IOS_ID env variable"), // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
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
          Thank you for choosing to help make our volunteer concerts a success!
          To begin, please sign in.
        </Text>

        <Pressable
          style={[styles.OAuth, styles.GoogleOAuth]}
          onPress={async () => {
            try {
              await GoogleSignin.hasPlayServices();
              const userInfo = await GoogleSignin.signIn();
              AsyncStorage.setItem("user", JSON.stringify(userInfo.user));
              AsyncStorage.setItem(
                "access-token",
                (await GoogleSignin.getTokens()).accessToken,
              );
              navigation.navigate("Home", { forceRerender: true });
            } catch (error) {
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
          <Image
            style={styles.OAuthLogo}
            source={require("../assets/google.png")}
          />
          <Text style={[styles.OAuthText]}> Sign in with Google</Text>
        </Pressable>

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
                AsyncStorage.setItem(
                  "user",
                  JSON.stringify({
                    // Apple Auth only returns fullName and email once
                    // https://docs.expo.dev/versions/latest/sdk/apple-authentication/#appleauthenticationsigninasyncoptions
                    // TODO: Use fullName and email while complying with data clearing policies
                    // name: `${credential.fullName.givenName} ${credential.fullName.familyName}`,
                    // email: credential.email,
                    name: "",
                    email: "",
                    id: "apple",
                  }),
                );
                AsyncStorage.setItem("access-token", credential.identityToken);
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
