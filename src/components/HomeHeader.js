/**
 * HomeHeader.js
 * Custom app header with gradient background, title, and user profile action.
 * Props:
 *  - navigation: React Navigation prop for screen navigation
 *  - route: React Navigation route prop to detect focus changes
 */

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Image, Pressable, SafeAreaView, StyleSheet, Text } from "react-native";

import colors from "../constants/colors";
import { getUser } from "../utils";

export default function HomeHeader({ navigation, route }) {
  // Local state for current user info
  const [user, setUser] = useState(null);

  // Fetch user from AsyncStorage whenever screen focus changes
  useEffect(() => {
    getUser(true).then(setUser);
  }, [route]);

  return (
    <LinearGradient
      colors={[colors.primaryLight, colors.primaryDark]}
      style={styles.container}
    >
      <SafeAreaView style={styles.subcontainer}>
        {/* App title */}
        <Text style={styles.headerText} selectable>
          Audacity Sign Up
        </Text>
        {/* Profile icon or user photo navigates to Account screen */}
        <Pressable onPress={() => navigation.navigate("Account")}>
          {user?.photo ? (
            <Image
              style={styles.profile}
              source={{ uri: user.photo, width: 40, height: 40 }}
            />
          ) : (
            <FontAwesome
              name="user-circle"
              size={40}
              color="white"
              style={styles.profile}
            />
          )}
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    paddingHorizontal: 20,
    paddingBottom: 10,
    justifyContent: "flex-end",
  },
  subcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: colors.white,
    fontSize: 23,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
});
