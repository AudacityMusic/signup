import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../constants/colors";

const NoInternetBanner = () => (
  <View style={styles.container}>
    <Text style={styles.text}>No Internet Connection</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.danger,
    padding: 10,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -25 }],
    zIndex: 1000,
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    textAlign: "center",
  },
});

export default NoInternetBanner;
