import { StyleSheet, Text, View, Image } from "react-native";

export default function Profile({email, name, profilePicture}) {
  return (
    <View style={styles.background}>
      <Image
        style={styles.image}
        source={{width: 50, height: 50, uri: profilePicture}}
      ></Image>
      <View>
        <Text style={styles.name}>Rick Astley</Text>
        <Text style={styles.email}>nevergonnagiveyouup@gmail.com</Text>
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
