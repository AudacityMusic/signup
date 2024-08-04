import { View, Image, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AccountScreen({ success }) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Ionicons
        name={success ? "checkmark-circle" : "close-circle"}
        size={144}
        color={success ? "green" : "red"}
        style={{ marginBottom: "15%" }}
      />
      <Text style={{ justifyContent: "center", fontSize: 24 }}>
        {success
          ? "Form submitted successfully"
          : "Error: Form submission was unsuccessful, try again later."}
      </Text>
    </View>
  );
}
