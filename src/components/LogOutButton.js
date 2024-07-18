import { StyleSheet, Text, Pressable } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../constants/colors";

export default function LogOutButton({ navigation }) {
  return (
    <Pressable
      style={styles.button}
      onPress={async () => {
        try {
          await GoogleSignin.signOut();
          AsyncStorage.removeItem("user");
          navigation.navigate("Sign In");
        } catch (error) {
          console.error(error);
        }
      }}
    >
      <Text style={styles.text}>Log Out</Text>
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
