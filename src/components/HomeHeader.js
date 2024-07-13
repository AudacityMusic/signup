import { Image, Text, StyleSheet, Pressable, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../constants/colors";

export default function HomeHeader({ navigation }) {
  return (
    <LinearGradient
      colors={[colors.primaryLight, colors.primaryDark]}
      style={styles.container}
    >
      <View style={styles.subcontainer}>
        <Text style={styles.headerText}>Audacity Music Club</Text>
        <Pressable onPress={() => navigation.navigate("Account")}>
          <Image
            style={styles.profile}
            source={require("../assets/placeholder-profile.png")}
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
