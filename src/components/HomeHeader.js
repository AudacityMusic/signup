import { useState, useEffect } from "react";
import { Image, Text, StyleSheet, Pressable, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../constants/colors";
import { getUser } from "../screens/SignInScreen";

export default function HomeHeader({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  return (
    <LinearGradient
      colors={[colors.primaryLight, colors.primaryDark]}
      style={styles.container}
    >
      <SafeAreaView style={styles.subcontainer}>
        <Text style={styles.headerText}>Audacity Music Club</Text>
        <Pressable onPress={() => navigation.navigate("Account")}>
          <Image
            source={{
              uri: user?.photo ?? require("../assets/placeholder-profile.png"),
            }}
            style={styles.profile}
          />
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
