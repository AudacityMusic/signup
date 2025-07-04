/**
 * Heading.js
 * Simple text heading component for section titles.
 * Props:
 *  - children: text or components to render inside the heading
 */

import { StyleSheet, Text } from "react-native";

export default function Heading({ children }) {
  return (
    <Text style={styles.container} selectable={true}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});
