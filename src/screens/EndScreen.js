/**
 * EndScreen.js
 * Displayed after form submission to indicate success or failure.
 * Props:
 *  - route.params.isSuccess: boolean indicating submission result
 *  - navigation: React Navigation prop for navigating back to Home
 */

import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function EndScreen({ route, navigation }) {
  // Determine icon and message based on submission outcome
  const { isSuccess } = route.params;

  return (
    <View style={styles.container}>
      {/* Success or error icon */}
      <Ionicons
        name={isSuccess ? "checkmark-circle" : "close-circle"}
        size={144}
        color={isSuccess ? "green" : "red"}
        style={styles.icon}
      />
      {/* Message text */}
      <Text style={styles.message} selectable>
        {isSuccess
          ? "Form submitted successfully"
          : "Error: Form submission was unsuccessful. Please contact the IT team for assistance."}
      </Text>
      {/* Return to Home button */}
      <Pressable
        onPress={() => {
          navigation.navigate("Home", { forceRerender: true });
        }}
      >
        <Text
          style={{
            paddingTop: "2%",
            textDecorationLine: "underline",
            fontSize: 22,
            fontWeight: "bold",
          }}
        >
          Return to Home
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 0.9,
  },
  icon: {
    marginBottom: "5%",
  },
  message: {
    textAlign: "center",
    fontSize: 24,
  },
});
