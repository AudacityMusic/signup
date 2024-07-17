import { StyleSheet, Text, TextInput, View } from "react-native";

export default function TextField({
  title,
  subtitle = "",
  setText,
  keyboardType,
  borderColor = "black",
  defaultText = "",
  setY = (y) => {},
}) {
  return (
    // TODO
    <View
      onLayout={(event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setY(y);
      }}
    >
      <Text style={{ fontSize: 20 }}>
        <Text>{title}</Text>
        {title.slice(-10) == "(optional)" ? (
          <Text></Text>
        ) : (
          <Text style={{ color: "red" }}> *</Text>
        )}
      </Text>
      <Text style={{ fontSize: 1 }}>{"\n"}</Text>
      <Text style={{ fontSize: subtitle ? 15 : 5, color: "#707070" }}>{subtitle}</Text>
      <TextInput
        style={[styles.inputField, { borderColor: borderColor }]}
        defaultValue={defaultText}
        onChangeText={(text) => setText(text)}
        keyboardType={keyboardType}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  inputField: {
    height: 40,
    borderRadius: 15,
    borderWidth: 3,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: "10%",
  },
});
