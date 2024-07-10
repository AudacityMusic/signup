import { StyleSheet, Text, TextInput, View } from "react-native";

export default function TextField({
  title,
  subtitle = "",
  setText,
  keyboardType,
}) {
  return (
    // TODO
    <View>
      <Text style={{ fontSize: 25 }}>
        <Text>{title}</Text>
        <Text style={{ color: "red" }}> *</Text>
      </Text>
      <Text style={{ fontSize: 1 }}>{"\n"}</Text>
      <Text style={{ fontSize: 20, color: "#707070" }}>{subtitle}</Text>
      <TextInput
        style={styles.inputField}
        onChangeText={(text) => setText(text)}
        keyboardType={keyboardType}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  inputField: {
    height: 50,
    borderRadius: 15,
    borderWidth: 3,
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: "10%",
  },
});
