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

GoogleSignin.configure({
  webClientId:
    "761199370622-3r5phtt6a1s6lm6554htodbk8u4k9p8f.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  iosClientId:
    "761199370622-qdq0afvq19r47p34rgjsso84leub5dlj.apps.googleusercontent.com", // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

export async function getUser() {
  try {
    const userString = await AsyncStorage.getItem("user");
    if (userString === null) {
      throw "EMPTY User";
    }
    return JSON.parse(userString);
  } catch (error) {
    console.error(error);
  }
}

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
              console.log(
                "name: " +
                  userInfo.user.name +
                  "\nemail: " +
                  userInfo.user.email +
                  "\nPhoto: " +
                  userInfo.user.photo,
              );
              navigation.navigate("Home");
            } catch (error) {
              if (isErrorWithCode(error)) {
                switch (error.code) {
                  case statusCodes.SIGN_IN_CANCELLED:
                    // user cancelled the login flow
                    console.error("Cancelled");
                    break;
                  case statusCodes.IN_PROGRESS:
                    // operation (eg. sign in) already in progress
                    console.error("In progress");
                    break;
                  case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    // play services not available or outdated
                    console.error("Play services not available or outdated");
                    break;
                  case statusCodes.SIGN_IN_REQUIRED:
                    console.error("Sign in required");
                    break;
                  default:
                    console.error(error);
                    break;
                }
              } else {
                console.error("No error code for: " + error);
                // an error that's not related to google sign in occurred
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
