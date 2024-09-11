import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

import { getUser } from "../utils";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  return (
    <View style={styles.container}>
      {user?.photo ? (
        <Image
          style={styles.image}
          source={{ width: 0, height: 0, uri: user.photo }} // size doesn't matter
        ></Image>
      ) : (
        <ActivityIndicator size="large"></ActivityIndicator>
      )}
      <View>
        <Text style={styles.name}>{user?.name ?? "Loading..."}</Text>
        <Text style={styles.email}>{user?.email ?? "Loading..."}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
