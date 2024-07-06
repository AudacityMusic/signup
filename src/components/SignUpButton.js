import { StyleSheet, Text, View, Image } from "react-native";

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
    backgroundColor: "#007913",
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
