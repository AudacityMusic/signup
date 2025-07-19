/**
 * FullWidthButton.js
 * A customizable full-width pressable button.
 * Props:
 *  - buttonStyle: additional styling for the button container
 *  - textStyle: additional styling for the button text
 *  - onPress: callback when the button is pressed
 *  - children: button label text or components
 */

import { Pressable, StyleSheet, Text } from "react-native";

export default function FullWidthButton({
  buttonStyle,
  textStyle,
  onPress,
  children,
}) {
  return (
    <Pressable
      // Combine external and internal styles for the button
      style={[buttonStyle, styles.button]}
      onPress={onPress}
    >
      {/* Button label */}
      <Text style={[textStyle, styles.text]}>{children}</Text>
    </Pressable>
  );
}

// Default styles for FullWidthButton
const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 110,
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
    alignSelf: "center",
  },
  text: {
    fontSize: 18,
  },
});
