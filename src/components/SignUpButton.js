import { StyleSheet, Text, View, Image } from "react-native";
import colors from "../constants/colors";

export default function SignUpButton() {
  return (
    <View style={styles.signUp}>
      <Text>{"\n\n\n"}</Text>
      <Text style={styles.signUpText}>Sign Up</Text>
      <Image
        source={require("./../assets/caret-left.png")}
        style={styles.caret}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  signUp: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "5%",
    borderRadius: 15,
    height: 50,
    width: 120,
    backgroundColor: colors.primary,
    marginBottom: 35
  },

  signUpText: {
    fontSize: 20,
    color: "white",
  },
  caret: {
    transform: [{ scaleX: -1 }],
    tintColor: "white",
  },
});
