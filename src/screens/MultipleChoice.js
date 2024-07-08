// MultipleChoice.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MultipleChoice = ({ options, selectedOption, onSelect }) => {
  return (
    <View>
      <Text style={styles.label}>Performance Type *</Text>
      {options.map(option => (
        <TouchableOpacity key={option.value} style={styles.option} onPress={() => onSelect(option.value)}>
          <View style={styles.radioCircle}>
            {selectedOption === option.value && <View style={styles.selectedRb} />}
          </View>
          <Text style={[styles.optionText, selectedOption === option.value && styles.selectedText]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#444',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 14,
  },
  selectedText: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
});

export default MultipleChoice;
