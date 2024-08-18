import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function VolunteerOpportunity({
  navigation,
  title,
  location,
  date,
  image,
  description,
  tags,
  formURL,
  isSubmitted,
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
          formURL,
          isSubmitted,
        })
      }
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          style={styles.image}
          source={{ width: 0, height: 0, uri: image }}
        />
        <View style={{ flexDirection: "column", alignSelf: "center" }}>
          <Text style={styles.title}>
            {title.length <= 19 ? title : title.slice(0, 16) + "..."}
          </Text>
          <Text style={styles.info}>
            <MaterialCommunityIcons
              name="clock-time-five-outline"
              size={10}
              color="black"
              style={styles.icon}
            />
            {"  "}
            {date}
          </Text>
          <Text style={styles.info}>
            <SimpleLineIcons
              name="location-pin"
              size={10}
              color="black"
              style={styles.icon}
            />
            {"  "}
            {location}
          </Text>
        </View>
      </View>
      <FontAwesome
        name={isSubmitted ? "check" : "chevron-right"}
        size={25}
        color="black"
        style={isSubmitted ? styles.checkmark : styles.caret}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 1000,
    borderTopLeftRadius: 1000,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    marginBottom: 10,
    marginRight: 10,
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
    marginRight: 20,
  },
  checkmark: {
    marginRight: 20,
    width: 25,
    height: 25,
    tintColor: "black",
  },
});
