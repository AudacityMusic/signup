import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";

export default function SignUpButton() {
  return (
    <View style={styles.container}>
      <Text>{"\n\n\n"}</Text>
      <Text style={styles.signUpText}>Sign Up</Text>
      <FontAwesome name="chevron-right" size={20} color="white" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: "3%",
    borderRadius: 15,
    height: 50,
    width: 120,
    backgroundColor: colors.primary,
    marginBottom: 5,
  },

  signUpText: {
    fontSize: 20,
    color: "white",
    paddingBottom: "3%",
  },
  caret: {
    transform: [{ scaleX: -1 }],
    tintColor: "white",
  },
});
