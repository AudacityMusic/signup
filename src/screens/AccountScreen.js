import { Alert, StyleSheet, View } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

import FullWidthButton from "../components/FullWidthButton.js";
import Profile from "../components/Profile.js";

import colors from "../constants/colors";

export default function AccountScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Profile />
      <FullWidthButton
        buttonStyle={styles.clearDataButton}
        textStyle={styles.clearDataText}
        onPress={() => {
          Alert.alert(
            "Are you sure you want to clear all data on this device?",
            `You will be logged out and prompted to sign in if you proceed. To clear data that you have submitted to Audacity Music Club in previous forms, please contact the IT Team at ${Constants.expoConfig.extra.email}.`,
            [
              {
                text: "Cancel",
                onPress: () => {},
                isPreferred: true,
              },
              {
                text: "Continue",
                onPress: async () => {
                  try {
                    await GoogleSignin.revokeAccess();
                    await GoogleSignin.signOut();
                  } catch (error) {
                    console.error(
                      `Unable to log out and remove Google account while clearing data: ${error}`,
                    );
                  }
                  try {
                    await AsyncStorage.clear();
                  } catch (error) {
                    console.error(`Unable to clear data: ${error}`);
                  }
                  navigation.navigate("Sign In");
                },
              },
            ],
          );
        }}
      >
        Clear Data
      </FullWidthButton>
      <FullWidthButton
        buttonStyle={styles.logOutButton}
        textStyle={styles.logOutText}
        onPress={() => {
          Alert.alert("Are you sure you want to log out?", null, [
            {
              text: "Cancel",
              onPress: () => {},
              isPreferred: true,
            },
            {
              text: "Continue",
              onPress: async () => {
                try {
                  await GoogleSignin.signOut();
                  await AsyncStorage.removeItem("user");
                } catch (error) {
                  console.error(`Unable to log out: ${error}`);
                }
                navigation.navigate("Sign In");
              },
            },
          ]);
        }}
      >
        Log Out
      </FullWidthButton>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  clearDataButton: {
    borderColor: colors.danger,
    borderWidth: 1,
  },
  clearDataText: {
    color: colors.danger,
  },
  logOutButton: {
    backgroundColor: colors.danger,
  },
  logOutText: {
    color: colors.white,
  },
});
