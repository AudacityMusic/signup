/**
 * TextFieldGroup.js
 * Renders multiple related text inputs under one heading.
 * Props:
 *  - title: label for the group
 *  - n: number of input fields
 *  - maxLength: maximum characters per field
 *  - state: { value: array of strings, y: number, valid: boolean }
 *  - setState: setter to update component state
 */

import { StyleSheet, Text, TextInput, View } from "react-native";
import colors from "../constants/colors";

export default function TextFieldGroup({
  title,
  n,
  maxLength = 32000, // Limit of chars on Google Forms
  state,
  setState,
}) {
  return (
    <View
      // Capture vertical position for error focus
      onLayout={(event) => {
        const y = event.nativeEvent.layout.y;
        setState((prev) => ({ ...prev, y }));
      }}
    >
      {/* Group heading and required marker */}
      <Text style={styles.heading} selectable>
        <Text style={{ color: state.valid ? "black" : colors.danger }}>
          {title}
        </Text>
        {title && !title.endsWith("(optional)") && (
          <Text style={{ color: "red" }}> *</Text>
        )}
      </Text>

      {/* Render n TextInput fields */}
      {Array(n)
        .fill()
        .map((_, i) => (
          <TextInput
            key={`${title}${i}`}
            style={[
              styles.inputField,
              {
                borderColor: state.valid ? "black" : colors.danger,
                marginBottom: i === n - 1 ? 20 : 5,
              },
            ]}
            onChangeText={(text) => {
              setState((prev) => {
                const newValue = [...prev.value];
                newValue[i] = text;
                return { ...prev, value: newValue };
              });
            }}
            value={state.value[i]}
            maxLength={maxLength}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: "600",
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondary,
  },
  inputField: {
    height: 40,
    fontSize: 18,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    textAlign: "center",
  },
});
