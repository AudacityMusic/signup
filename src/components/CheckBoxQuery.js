import { StyleSheet, Text, TextInput, View } from "react-native";
import { Checkbox } from "expo-checkbox";
import { useState } from "react";

export default function CheckBoxQuery(props) {
  const [yes, setYes] = useState(false);
  const [no, setNo] = useState(false);

  return (
    // TODO
    <View style={styles.container}>
      <Text style={[styles.text, { paddingBottom: "2%" }]}>
        {props.question}
        <Text style={[styles.text, styles.red]}>*</Text>
      </Text>
      <View style={{ flexDirection: "row", paddingVertical: "1%" }}>
        <Checkbox
          color={"#0d79ff"}
          value={yes}
          onValueChange={setYes}
          style={{ borderRadius: 20, transform: [{ scale: 1.3 }] }}
        />
        <Text style={[styles.text, { paddingHorizontal: "3%" }]}>Yes</Text>
        <Checkbox
          color={"#0d79ff"}
          value={no}
          onValueChange={setNo}
          style={{ borderRadius: 20, transform: [{ scale: 1.3 }] }}
        />
        <Text style={[styles.text, { paddingHorizontal: "3%" }]}>No</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  red: {
    color: "red",
  },
  container: {
    flexGrow: 1,
  },
  text: {
    fontSize: 14,
  },
});
