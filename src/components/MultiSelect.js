import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";

export default function MultiSelect({
  state,
  setState,
  title,
  options,
  required = false,
}) {
  const [selected, setSelected] = useState(
    new Array(options.length).fill(false),
  );

  return (
    <View
      onLayout={(event) => {
        setState((prevState) => ({
          ...prevState,
          y: event.nativeEvent.layout.y,
        }));
      }}
      style={styles.container}
    >
      <Text style={styles.heading}>
        <Text style={{ color: state.valid ? "black" : "red" }}>{title}</Text>
        {required ? <Text style={{ color: "red" }}> *</Text> : null}
      </Text>
      {options.map((option, index) => (
        <Pressable
          key={index * 4}
          onPress={() => {
            setState((previous) => {
              const newValue = selected[index]
                ? previous.value.filter((item) => item !== option)
                : [...previous.value, option];
              return { ...previous, value: newValue };
            });

            setSelected((previous) => {
              const next = [...previous]; // Create a new copy of the array
              next[index] = !previous[index];
              return next;
            });
          }}
        >
          <View key={index * 4 + 1} style={{ flexDirection: "row" }}>
            <MaterialCommunityIcons
              key={index * 4 + 2}
              name={
                selected[index] ? "checkbox-marked" : "checkbox-blank-outline"
              }
              size={24}
              color={selected[index] ? colors.blue : colors.black}
            />
            <Text key={index * 4 + 3} style={styles.optionText}>
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
});
