/**
 * CheckBoxQuery.js
 * Renders a labeled Yes/No checkbox question in a form.
 * Props:
 *  - question: the question text to display
 *  - state: { value: string, y: number, valid: boolean } state object from parent hook
 *  - setState: setter function to update question state
 *  - showNo: whether to display the 'No' option (default true)
 */

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
      // Capture layout y-coordinate for scrolling purposes
      onLayout={(event) => {
        const y = event.nativeEvent.layout.y;
        setState((prev) => ({ ...prev, y }));
      }}
    >
      {/* Question header with required marker */}
      <Text
        style={[
          styles.header,
          { color: state.valid ? "black" : colors.danger },
        ]}
        selectable
      >
        {question}
        <Text style={{ color: "red" }}>{" *"}</Text>
      </Text>

      {/* Yes/No options container */}
      <View style={styles.checkBoxContainer}>
        {/* Yes option */}
        <Checkbox
          color={colors.blue}
          value={state.value === "Yes"}
          onValueChange={() =>
            setState((prev) => ({ ...prev, value: "Yes", valid: true }))
          }
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

        {showNo && (
          <>
            {/* No option */}
            <Checkbox
              color={colors.blue}
              value={state.value === "No"}
              onValueChange={() =>
                setState((prev) => ({ ...prev, value: "No", valid: true }))
              }
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
        )}
      </View>
    </View>
  );
}

// Styles for CheckBoxQuery component
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
