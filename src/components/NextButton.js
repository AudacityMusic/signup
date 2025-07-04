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
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingRight: 10,
    borderRadius: 15,
    backgroundColor: colors.primary,
  },
  nextText: {
    fontSize: 20,
    color: "white",
    paddingHorizontal: 10,
  },
});
