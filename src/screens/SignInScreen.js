import React, {useState} from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Linking, Pressable, Image} from "react-native";

import BackButton from "../components/BackButton";

export default function SignInScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Pressable>
        <BackButton />
      </Pressable>
      <View style={styles.body}>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.paragraph}>
          {"\n"}
          {"Thank you for choosing to help\n"}
          {"make our volunteer concerts a\n"}
          {"success! To begin, please sign\n"}
          {"in using your Google account.\n"}
        </Text>

        <Pressable style={[styles.OAuth, styles.GoogleOAuth]}>
          <Image style={styles.OAuthLogo} source={require("./../assets/google-logo.png")}/>
          <Text style={[styles.OAuthText]}>  Sign in with Google</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: "1%"
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
    borderRadius: 10,
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
    backgroundColor: "#000",
    color: "#fff",
  },
});