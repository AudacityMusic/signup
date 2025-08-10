import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";

/**
 * MultiSelect.js
 * Renders a list of checkboxes allowing multiple selections.
 * Props:
 *  - state: { value: array, y: number, valid: boolean }
 *  - setState: function to update component state
 *  - title: heading text for the group
 *  - options: array of option strings
 *  - required: whether at least one selection is required
 */

export default function MultiSelect({
  state,
  setState,
  title,
  options,
  required = false,
}) {
  // Track selected option booleans locally to render UI markers
  const [selected, setSelected] = useState(
    new Array(options.length).fill(false),
  );

  return (
    <View
      style={styles.container}
      // Capture component vertical position for scrolling
      onLayout={(event) => {
        const y = event.nativeEvent.layout.y;
        setState((prev) => ({ ...prev, y }));
      }}
    >
      {/* Group title with required marker if needed */}
      <Text style={styles.heading} selectable>
        <Text style={{ color: state.valid ? "black" : "red" }}>{title}</Text>
        {required ? <Text style={{ color: "red" }}> *</Text> : null}
      </Text>

      {/* Render a checkbox for each option */}
      {options.map((option, index) => (
        <Pressable
          key={index}
          style={styles.optionContainer}
          onPress={() => {
            // Toggle selection and update parent state value array
            setState((prev) => {
              const newValue = selected[index]
                ? prev.value.filter((v) => v !== option)
                : [...prev.value, option];
              return { ...prev, value: newValue, valid: true };
            });
            // Update local selected toggle
            setSelected((prev) => {
              const next = [...prev];
              next[index] = !prev[index];
              return next;
            });
          }}
        >
          <View style={styles.row}>
            <MaterialCommunityIcons
              name={
                selected[index] ? "checkbox-marked" : "checkbox-blank-outline"
              }
              size={24}
              color={selected[index] ? colors.blue : colors.black}
            />
            <Text
              style={[
                styles.optionText,
                !state.valid && { color: colors.danger },
              ]}
            >
              {option}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    flexWrap: "wrap",
  },

  optionText: {
    fontSize: 16,
    marginLeft: 10,
    flexWrap: "wrap",
  },

  optionContainer: {
    flexDirection: "row",
  },

  row: {
    flexDirection: "row",
  },
});
