/**
 * AccountScreen.js
 * Allows the user to clear all app data or log out of their account.
 * - Presents Profile component
 * - Provides buttons to clear local storage or log out
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import { Alert, StyleSheet, View } from "react-native";

import FullWidthButton from "../components/FullWidthButton.js";
import Profile from "../components/Profile.js";
// import AppleAuthTestHelper from "../components/AppleAuthTestHelper.js"; // Remove in production

import colors from "../constants/colors";
import { alertError } from "../utils/index.js";

export default function AccountScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* User profile summary */}
      <Profile />

      {/* Development Test Helper - Remove this in production */}
      {/* <AppleAuthTestHelper /> */}

      {/* Clear all local data and sign out */}
      <FullWidthButton
        buttonStyle={styles.clearDataButton}
        textStyle={styles.clearDataText}
        onPress={() => {
          Alert.alert(
            "Are you sure you want to clear all data on this device?",
            `You will be logged out and prompted to sign in if you proceed. To clear data that you have submitted to Audacity Sign Up in previous forms, please contact the IT Team at ${Constants.expoConfig.extra.email}.`,
            [
              {
                text: "Cancel",
                onPress: () => {},
                isPreferred: true,
              },
              {
                text: "Continue",
                onPress: async () => {
                  if (GoogleSignin.getCurrentUser() != null) {
                    try {
                      await GoogleSignin.revokeAccess();
                      await GoogleSignin.signOut();
                    } catch (error) {
                      alertError(
                        `Unable to log out and remove Google account while clearing data: ${error}`,
                      );
                    }
                  }
                  try {
                    await AsyncStorage.clear();
                  } catch (error) {
                    alertError(`Unable to clear data: ${error}`);
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

      {/* Log out of Google or local user */}
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
                if (GoogleSignin.getCurrentUser() != null) {
                  try {
                    await GoogleSignin.signOut();
                  } catch (error) {
                    alertError(`Unable to log out of Google: ${error}`);
                  }
                }
                try {
                  await AsyncStorage.removeItem("user");
                  await AsyncStorage.removeItem("access-token");
                } catch (error) {
                  alertError(`Unable to remove user data: ${error}`);
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
