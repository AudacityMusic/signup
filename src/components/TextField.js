import { StyleSheet, Text, TextInput, View } from "react-native";
import colors from "../constants/colors";

export default function TextField({
  title,
  subtitle = "",
  keyboardType = "default",
  maxLength = 32000, // Limit of chars on Google Forms
  state,
  setState,
  extraMargin = true,
}) {
  return (
    <View
      onLayout={(event) => {
        const y = event.nativeEvent.layout.y;
        setState((prevState) => ({
          ...prevState,
          y,
        }));
      }}
    >
      <Text style={styles.heading} selectable={true}>
        <Text
          style={{
            color: !state.valid ? colors.danger : "black",
          }}
        >
          {title}
        </Text>
        {title == "" || title.slice(-10) == "(optional)" ? null : (
          <Text style={{ color: "red" }}> *</Text>
        )}
      </Text>
      <Text style={styles.subtitle} selectable={true}>
        {subtitle}
      </Text>
      <TextInput
        style={[
          styles.inputField,
          {
            borderColor: state.valid ? "black" : colors.danger,
            marginBottom: extraMargin ? 20 : 0,
          },
        ]}
        onChangeText={(text) => {
          setState((prevState) => ({
            ...prevState,
            value: text,
          }));
        }}
        value={state.value}
        maxLength={maxLength}
        // @ts-expect-error
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
  },
});
