import { StyleSheet, Text, View, Image } from "react-native";

export default function NextButton() {
  return (
    <View style={styles.back}>
      <Text style={styles.backText}>{"Next"}</Text>
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
    justifyContent: "flex-end",
    borderRadius: 15,
    height: 60,
    width: 120,
    backgroundColor: "black",
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
