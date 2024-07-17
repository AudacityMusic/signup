import { useState, useEffect } from "react";
import { Image, Text, StyleSheet, Pressable, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../constants/colors";
import { getUser } from "../screens/SignInScreen";

export default function HomeHeader({ navigation }) {
  const [user, setUser] = useState(JSON.parse("{}"));

  useEffect(() => {
    async function asynchronouslyGetUser() {
      return await getUser();
    }
    setUser(asynchronouslyGetUser());
  }, []);

  console.log(JSON.stringify(user));

  return (
    <LinearGradient
      colors={[colors.primaryLight, colors.primaryDark]}
      style={styles.container}
    >
      <View style={styles.subcontainer}>
        <Text style={styles.headerText}>Audacity Music Club</Text>
        <Pressable onPress={() => navigation.navigate("Account")}>
        <Image
          source={{width: 250, height: 250, uri: user.photo}}
          style={styles.profile}
        />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120,
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
    fontSize: 20,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
});
