import { Checkbox } from "expo-checkbox";
import { StyleSheet, Text, View } from "react-native";

import colors from "../constants/colors";

export default function CheckBoxQuery({
  question,
  state,
  setState,
  showNo = true,
}) {
  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const y = event.nativeEvent.layout.y;
        setState((prevState) => ({
          ...prevState,
          y,
        }));
      }}
    >
      <Text
        style={[
          styles.header,
          { color: state.valid ? "black" : colors.danger },
        ]}
        selectable={true}
      >
        {question}
        <Text style={{ color: "red" }}>{" *"}</Text>
      </Text>
      <View style={styles.checkBoxContainer}>
        <Checkbox
          color={colors.blue}
          value={state.value == "Yes"}
          onValueChange={() => {
            setState((prevState) => ({
              ...prevState,
              value: "Yes",
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
        {showNo ? (
          <>
            <Checkbox
              color={colors.blue}
              value={state.value == "No"}
              onValueChange={() => {
                setState((prevState) => ({
                  ...prevState,
                  value: "No",
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
          </>
        ) : null}
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
