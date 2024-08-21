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
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  text: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default NoInternetBanner;
