import { View, Text, Pressable, StyleSheet } from "react-native";
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
      onLayout={(event) => {
        setState((prevState) => ({
          ...prevState,
          y: event.nativeEvent.layout.y,
        }));
      }}
    >
      <Text style={styles.label}>
        <Text style={{ color: state.valid ? "black" : colors.danger }}>{title}</Text>
        <Text style={{ color: "red" }}> *</Text>
      </Text>
      {mapObject(options, (key) => (
        <Pressable
          key={key}
          style={styles.option}
          onPress={() => onSelect(key)}
        >
          <View style={styles.radioCircle}>
            {state.value === key && <View style={styles.selectedRb} />}
          </View>
          <Text
            style={[
              styles.optionText,
              state.value === key && styles.selectedText,
            ]}
          >
            {options[key].label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
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
    backgroundColor: "#1E90FF",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    flexWrap: "wrap",
  },
  selectedText: {
    color: "#1E90FF",
    fontWeight: "condensedBold",
  },
});

function mapObject(obj, callback) {
  const items = [];
  for (const key in obj) {
    items.push(callback(key));
  }
  return items;
}
