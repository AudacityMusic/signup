/**
 * MultipleChoice.js
 * Renders a group of mutually-exclusive options (radio buttons).
 * Props:
 *  - title: question title text
 *  - options: array of option strings
 *  - onSelect: callback when an option is selected
 *  - state: { value: chosenOption, y: layoutY, valid: boolean }
 *  - setState: setter to update component state
 */

import { Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";

export default function MultipleChoice({
  title,
  options,
  onSelect,
  state,
  setState,
}) {
  return (
    <View
      style={{ marginBottom: 20 }}
      // Capture layout position for scroll-to-error support
      onLayout={(event) => {
        const y = event.nativeEvent.layout.y;
        setState((prev) => ({ ...prev, y }));
      }}
    >
      {/* Question title with required marker */}
      <Text style={styles.title} selectable>
        <Text style={{ color: state.valid ? "black" : colors.danger }}>
          {title}
        </Text>
        <Text style={{ color: "red" }}> *</Text>
      </Text>
      {/* Render each option as pressable radio button */}
      {options.map((value) => (
        <Pressable
          key={value}
          style={styles.option}
          onPress={() => {
            onSelect(value);
            setState((prev) => ({ ...prev, valid: true }));
          }}
        >
          <View style={styles.radioCircle}>
            {state.value === value && <View style={styles.selectedRb} />}
          </View>
          <Text
            style={[
              styles.optionText,
              state.value === value && styles.selectedText,
              !state.valid && { color: colors.danger },
            ]}
          >
            {value}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.blue,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    flexWrap: "wrap",
  },
  selectedText: {
    color: colors.blue,
    fontWeight: "condensedBold",
  },
});
