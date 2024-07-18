import { StyleSheet, Text, View } from "react-native";
import { Checkbox } from "expo-checkbox";

export default function CheckBoxQuery({ question, state, useState }) {
  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        useState((prevState) => ({
          ...prevState,
          y: event.nativeEvent.layout.y,
        }));
      }}
    >
      <Text style={[styles.header, { color: state.valid ? "black" : "red" }]}>
        {question}
        <Text style={styles.red}>{" *"}</Text>
      </Text>
      <View style={styles.checkBoxContainer}>
        <Checkbox
          color={"#0d79ff"}
          value={state.value == true}
          onValueChange={() => {
            useState((prevState) => ({
              ...prevState,
              value: true,
            }));
          }}
          style={{ borderRadius: 20, transform: [{ scale: 1.3 }] }}
        />
        <Text style={[styles.text, { color: state.valid ? "black" : "red" }]}>
          Yes
        </Text>
        <Text> </Text>
        <Checkbox
          color={"#0d79ff"}
          value={state.value == false}
          onValueChange={() => {
            useState((prevState) => ({
              ...prevState,
              value: false,
            }));
          }}
          style={{ borderRadius: 20, transform: [{ scale: 1.3 }] }}
        />
        <Text style={[styles.text, { color: state.valid ? "black" : "red" }]}>
          No
        </Text>
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
    marginBottom: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 15,
  },
  text: {
    fontSize: 18,
    paddingLeft: 8,
    paddingRight: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
  },
});
