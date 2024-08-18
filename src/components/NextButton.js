import { StyleSheet, Text, View, Image } from "react-native";

export default function NextButton() {
  return (
    <View style={styles.container}>
      <Text style={styles.nextText}>{"Next"}</Text>
      <Image
        source={require("./../assets/caret-left.png")}
        style={styles.caret}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    height: 60,
    width: 120,
    backgroundColor: "black",
    paddingLeft: "4%",
  },

  nextText: {
    fontSize: 25,
    color: "white",
  },
  caret: {
    transform: [{ scaleX: -1 }],
    tintColor: "white",
  },
});
