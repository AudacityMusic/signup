import { useState, useEffect } from "react";

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Image,
} from "react-native";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BackButton from "../components/BackButton";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const ANDROID_CLIENT_ID = "761199370622-jil48n0qf2v7k01td350tponk1f8digo.apps.googleusercontent.com";
  const iOS_CLIENT_ID = "761199370622-qdq0afvq19r47p34rgjsso84leub5dlj.apps.googleusercontent.com";
  const WEB_CLIENT_ID = "761199370622-3r5phtt6a1s6lm6554htodbk8u4k9p8f.apps.googleusercontent.com";

  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: iOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
  });

  useEffect(() => {
    handleEffect();
  }, [response, token]);

  async function handleEffect() {
    const user = await getLocalUser();
    console.log("user", user);
    if (!user) {
      if (response?.type === "success") {
        // setToken(response.authentication.accessToken);
        getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(user);
      console.log("loaded locally");
    }
  }

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    return JSON.parse(data);
  };

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };

  AsyncStorage.removeItem("@user");

  return (
    <SafeAreaView style={styles.container}>
      <Pressable>
        <BackButton />
      </Pressable>
      <View style={styles.body}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.paragraph}>
          {"\n"}
          {"Thank you for choosing to help\n"}
          {"make our volunteer concerts a\n"}
          {"success! To begin, please sign\n"}
          {"in using your Google account.\n"}
        </Text>

        <Pressable style={[styles.OAuth, styles.GoogleOAuth]} onPress={() => {promptAsync();}}>
          <Image
            style={styles.OAuthLogo}
            source={require("../assets/google-logo.png")}
          />
          <Text style={[styles.OAuthText]}> Sign in with Google</Text>
          <Text>{JSON.stringify(userInfo, null, 2)}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: "1%",
  },

  body: {
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontWeight: "bold",
    fontSize: 45,
  },

  paragraph: {
    fontSize: 18,
  },

  OAuth: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    height: 50,
    borderRadius: 15,
  },

  OAuthLogo: {
    width: 40,
    height: 40,
  },

  OAuthText: {
    color: "#fff",
    fontSize: 25,
  },

  GoogleOAuth: {
    backgroundColor: "#353535",
    color: "#fff",
  },
});
