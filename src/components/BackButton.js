import { StyleSheet, Text, View, Image } from "react-native";

export default function BackButton(props) {
  return (
    <View>
      <View
        style={[
          styles.back,
          props.opaque ? { backgroundColor: "rgba(0,0,0,0.8)" } : {},
        ]}
      >
        <Image
          source={require("./../assets/caret-left.png")}
          style={props.opaque ? { tintColor: "white" } : {}}
        />
        <Text style={[styles.backText, props.opaque ? { color: "white" } : {}]}>
          Back
        </Text>
      </View>
      <Text>{"\n".repeat(1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    flexDirection: "row",
    alignItems: "center"
  },

  backText: {
    fontSize: 25,
  },
});
