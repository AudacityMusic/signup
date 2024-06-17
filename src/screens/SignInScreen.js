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
          {}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: "1%"
  },

  back: {
    flexDirection: "row",
    alignItems: "center",
  },

  backText: {
    fontWeight: "bold",
    fontSize: 25,
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
    fontSize: 30,
  },
});