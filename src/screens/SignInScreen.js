import React, {useState} from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Linking, Pressable } from "react-native";

export default function SignInScreen() {
  return (
    <SafeAreaView>
      <Pressable>
        <Image source={require("./src/assets/back.png")} />
      </Pressable>
      <View style={styles.container}>
        <Text style={styles.title}>Sign in</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontWeight: "bold",
    fontSize: 24,
  }
});