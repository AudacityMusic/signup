import { StyleSheet, Text, View, Image } from "react-native";
import colors from "../constants/colors";

export default function SignUpButton() {
  return (
    <View style={styles.back}>
      <Text>{"\n\n\n"}</Text>
      <Text style={styles.backText}>Sign Up</Text>
      <Image
        source={require("./../assets/caret-left.png")}
        style={styles.caret}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "5%",
    borderRadius: 15,
    height: 59,
    width: 145,
    backgroundColor: colors.primary,
  },

  backText: {
    fontSize: 25,
    color: "white",
  },
  caret: {
    transform: [{ scaleX: -1 }],
    tintColor: "white",
  },
});
