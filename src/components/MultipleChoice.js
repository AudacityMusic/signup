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
      onLayout={(event) => {
        const y = event.nativeEvent.layout.y;
        setState((prevState) => ({
          ...prevState,
          y,
        }));
      }}
    >
      <Text style={styles.title} selectable={true}>
        <Text style={{ color: state.valid ? "black" : colors.danger }}>
          {title}
        </Text>
        <Text style={{ color: "red" }}> *</Text>
      </Text>
      {options.map((value) => (
        <Pressable
          key={value}
          style={styles.option}
          onPress={() => onSelect(value)}
        >
          <View style={styles.radioCircle}>
            {state.value === value && <View style={styles.selectedRb} />}
          </View>
          <Text
            style={[
              styles.optionText,
              state.value === value && styles.selectedText,
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
