import { StyleSheet, Text, TextInput, View } from "react-native";

export default function TextField({title, setText}) {
  return (
    // TODO
    <View style={styles.container}>
      <Text style={{fontSize: 20}}>
        <Text>{title}</Text>
        <Text style={styles.red}>*</Text>
      </Text>
      <TextInput style={styles.inputField} onChangeText={text => setText(text)}></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  inputField: {
    height: 50,
    borderRadius: 15,
    borderWidth: 3,
    fontSize: 35,
    textAlign: "center",
    marginBottom: 20,
  },
  red: {
    color: "red",
  },
  container: {
    // flex: 1,
  },
});
