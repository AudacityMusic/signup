/**
 * NextButton.js
 * Simple forward navigation button with label text and chevron icon.
 * Props:
 *  - children: the button label text
 */

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";

export default function NextButton({ children }) {
  return (
    <View style={styles.container}>
      {/* Button label */}
      <Text style={styles.nextText}>{children}</Text>
      {/* Chevron icon indicating next action */}
      <FontAwesome name="chevron-right" size={20} color="white" />
    </View>
  );
}

// Styles definitions
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: colors.primary,
    gap: 15,
  },
  nextText: {
    fontSize: 24,
    fontWeight: "500",
    color: "white",
    textAlignVertical: "center",
    includeFontPadding: false,
  },
});
