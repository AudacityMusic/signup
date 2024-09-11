import { Pressable, StyleSheet, Text } from "react-native";

export default function FullWidthButton({
  buttonStyle,
  textStyle,
  onPress,
  children,
}) {
  return (
    <Pressable style={[buttonStyle, styles.button]} onPress={onPress}>
      <Text style={[textStyle, styles.text]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 110,
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
    alignSelf: "center",
  },
  text: {
    fontSize: 18,
  },
});
