import { View, Text, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function EndScreen({ route, navigation }) {
  const { isSuccess } = route.params;

  return (
    <View style={styles.container}>
      <Ionicons
        name={isSuccess ? "checkmark-circle" : "close-circle"}
        size={144}
        color={isSuccess ? "green" : "red"}
        style={styles.icon}
      />
      <Text style={styles.message}>
        {isSuccess
          ? "Form submitted successfully"
          : "Error: Form submission was unsuccessful. Please contact the IT team for assistance."}
      </Text>
      <Pressable
        onPress={() => {
          navigation.navigate("Home");
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
    justifyContent: "center",
    fontSize: 24,
  },
});
