import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { getUser } from "../screens/SignInScreen";

export default function Profile() {
  const [user, setUser] = useState(JSON.parse("{}"));

  useEffect(() => {
    async function asynchronouslyGetUser() {
      return await getUser();
    }
    asynchronouslyGetUser().then(setUser);
  }, []);

  return (
    <View style={styles.background}>
      <Image
        style={styles.image}
        source={user.photo ? {width: 250, height: 250, uri: user.photo} : require("../assets/placeholder-profile.png")}
      ></Image>
      <View>
        <Text style={styles.name}>{user.name ? user.name : "..."}</Text>
        <Text style={styles.email}>{user.email ? user.name : "..."}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Light grey background color
    padding: 15,
    borderRadius: 10,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    margin: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#555",
  },
});
