import { StyleSheet, Text, View, Image } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export default function NextButton() {
  return (
    <View style={styles.back}>
      <Text style={styles.nextText}>{"Next"}</Text>
      <Feather name="chevron-right" size={32} color="white" />
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
    height: 60,
    width: 120,
    backgroundColor: "black",
    paddingLeft: "5%",
    paddingRight: "3%",
  },

  nextText: {
    fontSize: 25,
    color: "white",
    paddingBottom: "2%",
  },
  caret: {
    transform: [{ scaleX: -1 }],
    tintColor: "white",
  },
});
