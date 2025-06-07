import { StyleSheet, Text } from "react-native";

export default function Heading({ children }) {
  return <Text style={styles.container} selectable={true}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});
