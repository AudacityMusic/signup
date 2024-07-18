import { useState, useEffect } from "react";
import {
  Image,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../constants/colors";
import { getUser } from "../screens/SignInScreen";

export default function HomeHeader({ navigation }) {
  const [user, setUser] = useState(null);

  console.log("Pre-Get-User");
  useEffect(() => {
    getUser().then(setUser);
  }, []);
  console.log("Post-Get-User, result=" + JSON.stringify(user));

  return (
    <LinearGradient
      colors={[colors.primaryLight, colors.primaryDark]}
      style={styles.container}
    >
      <SafeAreaView style={styles.subcontainer}>
        <Text style={styles.headerText}>Audacity Music Club</Text>
        <Pressable onPress={() => navigation.navigate("Account")}>
          {user?.photo ? (
            <Image
              style={styles.profile}
              source={{ width: 0, height: 0, uri: user.photo }} // Size doesn't matter
            ></Image>
          ) : (
            <ActivityIndicator size="large"></ActivityIndicator>
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
