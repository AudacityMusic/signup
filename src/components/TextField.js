import { StyleSheet, Text, TextInput, View } from "react-native";

export default function TextField(props, setText) {
  return (
    // TODO
    <View style={styles.container}>
      <Text>
        {props.title}
        <Text style={styles.red}>*</Text>
      </Text>
      <TextInput style={styles.inputField} onChangeText={text => setText(text)}></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  inputField: {
    borderRadius: 15,
    borderWidth: 3,
    flexGrow: 0.5,
    textAlignVertical: "top",
  },
  red: {
    color: "red",
  },
  container: {
    flexGrow: 1,
  },
});
