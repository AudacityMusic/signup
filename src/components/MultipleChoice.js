// MultipleChoice.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const MultipleChoice = ({
  title,
  options,
  selectedOption,
  onSelect,
  color = "black",
  setY=(y)=>{},
}) => {
  return (
    <View 
      style={{ marginBottom: 20 }}
      onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          setY(y);
      }}
    >
      <Text style={styles.label}>
        <Text style={{ color: color }}>{title}</Text>
        <Text style={{ color: "red" }}> *</Text>
      </Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.option}
          onPress={() => onSelect(option.value)}
        >
          <View style={styles.radioCircle}>
            {selectedOption === option.value && (
              <View style={styles.selectedRb} />
            )}
          </View>
          <Text
            style={[
              styles.optionText,
              selectedOption === option.value && styles.selectedText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 25,
    marginVertical: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#444",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 20,
    flexWrap: "wrap",
  },
  selectedText: {
    color: "#1E90FF",
    fontWeight: "condensedBold",
  },
});

export default MultipleChoice;
