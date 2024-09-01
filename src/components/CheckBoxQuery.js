import { StyleSheet, Text, View } from "react-native";
import { Checkbox } from "expo-checkbox";
import colors from "../constants/colors";

export default function CheckBoxQuery({ question, state, setState }) {
  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        setState((prevState) => ({
          ...prevState,
          y: event.nativeEvent.layout.y,
        }));
      }}
    >
      <Text style={styles.header}>
        {question}
        <Text style={{ color: "red" }}>{" *"}</Text>
      </Text>
      <View style={styles.checkBoxContainer}>
        <Checkbox
          color={"#0d79ff"}
          value={state.value == true}
          onValueChange={() => {
            setState((prevState) => ({
              ...prevState,
              value: true,
            }));
          }}
          style={{ borderRadius: 20, transform: [{ scale: 1.3 }] }}
        />
        <Text
          style={[
            styles.text,
            { color: state.valid ? "black" : colors.danger },
          ]}
        >
          Yes
        </Text>
        <Text> </Text>
        <Checkbox
          color={"#0d79ff"}
          value={state.value == false}
          onValueChange={() => {
            setState((prevState) => ({
              ...prevState,
              value: false,
            }));
          }}
          style={{ borderRadius: 20, transform: [{ scale: 1.3 }] }}
        />
        <Text
          style={[
            styles.text,
            { color: state.valid ? "black" : colors.danger },
          ]}
        >
          No
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginBottom: 25,
    alignSelf: "flex-start",
  },
  checkBoxContainer: {
    flexDirection: "row",
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
    color: "black",
  },
});
