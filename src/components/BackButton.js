import { StyleSheet, Text, View, Image } from "react-native";

export default function BackButton(props) {
  return (
    <View
      style={[
        styles.back,
        props.opaque ? { backgroundColor: "rgba(0,0,0,0.8)" } : {},
      ]}
    >
      <Text>{"\n\n\n"}</Text>
      <Image
        source={require("./../assets/caret-left.png")}
        style={props.opaque ? { tintColor: "white" } : {}}
      />
      <Text style={[styles.backText, props.opaque ? { color: "white" } : {}]}>
        Back
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    paddingRight: "13%",
    borderRadius: 30,
    marginVertical: "-10%",
  },

  backText: {
    fontSize: 25,
  },
});
