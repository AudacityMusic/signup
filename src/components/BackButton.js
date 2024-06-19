import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default function BackButton() {
  return (
    <View style={styles.back}>
      <Text>{"\n\n\n"}</Text>
      <Image source={require("./../assets/caret-left.png")} />
      <Text style={styles.backText}>Back</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    flexDirection: "row",
    alignItems: "center",
  },

  backText: {
    fontSize: 25,
  },
});
