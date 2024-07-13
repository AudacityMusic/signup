import { StyleSheet, Text, Pressable, Alert } from "react-native";
import colors from "../constants/colors";

export default function LogOutButton() {
  return (
    <Pressable style={styles.button} onPress={() => Alert.alert("Log out")}>
      <Text style={styles.text}> Log Out</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.danger,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 110,
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
    alignSelf: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});
