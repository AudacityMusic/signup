/**
 * HomeHeader.js
 * Custom app header with gradient background and title
 */

import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, StyleSheet, Text } from "react-native";

import colors from "../constants/colors";

export default function HomeHeader() {
  return (
    <LinearGradient
      colors={[colors.primaryLight, colors.primaryDark]}
      style={styles.container}
    >
      <SafeAreaView style={styles.subcontainer}>
        <Text style={styles.headerText} selectable>
          Audacity Sign Up
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    paddingHorizontal: 20,
    paddingBottom: 10,
    justifyContent: "flex-end",
  },
  subcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: colors.white,
    fontSize: 23,
  },
});
