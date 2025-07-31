/**
 * TextField.js
 * Renders a labeled text input field with optional subtitle and validation styling.
 * Props:
 *  - title: label text displayed above the input
 *  - subtitle: optional explanatory text below the label
 *  - keyboardType: type of keyboard to display (default 'default')
 *  - maxLength: maximum number of characters allowed
 *  - state: { value: string, y: number, valid: boolean }
 *  - setState: setter to update component state
 *  - extraMargin: whether to add bottom margin after input
 */

import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import colors from "../constants/colors";

export default function TextField({
  title,
  subtitle = "",
  keyboardType = "default",
  maxLength = 32000, // Limit of chars on Google Forms
  state,
  setState,
  extraMargin = true,
  inputted = true,
  onPress = null
}) {
  return (
    <View
      // Capture layout Y position for scroll-to-error support
      onLayout={(event) => {
        const y = event.nativeEvent.layout.y;
        setState((prev) => ({ ...prev, y }));
      }}
    >
      {/* Heading and optional required marker */}
      <Text style={styles.heading} selectable>
        <Text style={{ color: state.valid ? "black" : colors.danger }}>
          {title}
        </Text>
        {/* Show '*' if field is required */}
        {title === "" || title.endsWith("(optional)") ? null : (
          <Text style={{ color: "red" }}> *</Text>
        )}
      </Text>
      {/* Subtitle text */}
      <Text style={styles.subtitle} selectable>
        {subtitle}
      </Text>
      {/* Text input with validation border color */}
      {inputted ?
        <TextInput
        style={[
          styles.inputField,
          {
            borderColor: state.valid ? "black" : colors.danger,
            marginBottom: extraMargin ? 20 : 0,
          },
        ]}
        onChangeText={(text) => setState((prev) => ({ ...prev, value: text }))}
        value={state.value}
        maxLength={maxLength}
        // @ts-expect-error
        keyboardType={keyboardType}
      />
      : onPress ? (
        <Pressable onPress={onPress} style={[styles.inputField, { borderColor: colors.secondary, justifyContent: 'center' }]}>
          <Text style={{ color: state.value ? 'black' : colors.secondary }}>
            {state.value || "Filter by date & time"}
          </Text>
        </Pressable>
      ) : (
        <View style={[styles.inputField, { borderColor: colors.secondary }]}>
          <Text style={{ color: colors.secondary }}>{title}</Text>
        </View>
      )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: "600",
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
