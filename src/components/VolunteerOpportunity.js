import { View, Text, StyleSheet, Image, Pressable } from "react-native";

export default function VolunteerOpportunity({
  navigation,
  title,
  location,
  date,
  image,
  description,
  tags,
}) {
  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigation.navigate("Volunteer Opportunity", {
          title,
          location,
          date,
          image,
          description,
          tags,
        })
      }
    >
      <Image
        style={styles.image}
        // source={require("./../assets/warm-springs-bart.png")}
        source={{ width: 0, height: 0, uri: image }}
      />
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.info}>
          <Image
            style={styles.icon}
            source={require("./../assets/clock.png")}
          />
          {"  "}
          {date}
        </Text>
        <Text style={styles.info}>
          <Image
            style={styles.icon}
            source={require("./../assets/location.png")}
          />
          {"  "}
          {location}
        </Text>
      </View>
      <Image
        style={styles.caret}
        source={require("./../assets/caret-left.png")}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 1000,
    borderTopLeftRadius: 1000,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: -5,
  },
  info: {
    fontSize: 10,
    color: "#555",
    marginTop: 1,
  },
  icon: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  caret: {
    width: 20,
    height: 50,
    marginLeft: 30,
    transform: [{ rotateZ: "180deg" }],
  },
});
