import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Image, Pressable, SafeAreaView, StyleSheet, Text } from "react-native";

import colors from "../constants/colors";
import { getUser } from "../utils";

export default function HomeHeader({ navigation, route }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser(true).then(setUser);
  }, [route]);

  return (
    <LinearGradient
      colors={[colors.primaryLight, colors.primaryDark]}
      style={styles.container}
    >
      <SafeAreaView style={styles.subcontainer}>
        <Text style={styles.headerText} selectable={true}>
          Audacity Sign Up
        </Text>
        <Pressable onPress={() => navigation.navigate("Account")}>
          {user?.photo ? (
            <Image
              style={styles.profile}
              source={{ width: 0, height: 0, uri: user.photo }} // Size doesn't matter
            ></Image>
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
