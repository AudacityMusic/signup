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
            color: state.valid ? "black" : colors.danger,
          }}
        >
          {title}
        </Text>
        {title == "" || title.slice(-10) == "(optional)" ? null : (
          <Text style={{ color: "red" }}> *</Text>
        )}
      </Text>
      {Array(n)
        .fill()
        .map((_, i) => (
          <TextInput
            key={`${title}${i}`}
            style={[
              styles.inputField,
              {
                borderColor: state.valid ? "black" : colors.danger,
                marginBottom: i == n - 1 ? 20 : 5,
              },
            ]}
            onChangeText={(text) => {
              setState((prevState) => {
                const newValue = prevState.value;
                newValue[i] = text;
                return {
                  ...prevState,
                  value: newValue,
                };
              });
            }}
            value={state.value}
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
