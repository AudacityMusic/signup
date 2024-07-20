import { StyleSheet, Text, TextInput, View } from "react-native";
import colors from "../constants/colors";

export default function TextField({
  title,
  subtitle = "",
  defaultText = "",
  keyboardType = "default",
  maxLength = 256,
  state,
  setState,
}) {
  return (
    <View
      onLayout={(event) => {
        setState((prevState) => ({
          ...prevState,
          y: event.nativeEvent.layout.y,
        }));
      }}
    >
      <Text style={styles.heading}>
        <Text>{title}</Text>
        {title.slice(-10) == "(optional)" ? null : (
          <Text style={{ color: "red" }}> *</Text>
        )}
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <TextInput
        style={[
          styles.inputField,
          { borderColor: state.valid ? "black" : "red" },
        ]}
        onChangeText={(text) => {
          setState((prevState) => ({
            ...prevState,
            value: text,
          }));
        }}
        value={state.value}
        maxLength={maxLength}
        // @ts-ignore
        keyboardType={keyboardType}
      />
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
    marginBottom: 20,
  },
});
