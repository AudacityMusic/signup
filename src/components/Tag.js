import { StyleSheet, Text, View, Image } from "react-native";

export default function Tag(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.tagText}>{props.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "#353535",
    alignSelf: "flex-start",
  },

  tagText: {
    fontSize: 16,
    paddingHorizontal: "2%",
    paddingVertical: "1%",
    color: "white",
  },
});
