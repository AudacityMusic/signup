import { Pressable, StyleSheet, Text, View } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function OtherOpportunities({ navigation }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.card, styles.first]}
        onPress={() =>
          navigation.navigate("Volunteer Form", {
            title: "Request a Concert",
            location: null,
            date: null,
          })
        }
      >
        <Entypo
          name="beamed-note"
          size={18}
          color="black"
          style={styles.icon}
        />
        <Text style={styles.text}>Request a Concert</Text>
        <FontAwesome
          name="chevron-right"
          size={20}
          color="black"
          style={styles.arrow}
        />
      </Pressable>
      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate("Volunteer Form", {
            title: "Audacity Dance Club",
            location: null,
            date: null,
          })
        }
      >
        <MaterialCommunityIcons
          name="human-female-dance"
          size={18}
          color="black"
          style={styles.icon}
        />
        <Text style={styles.text}>Sign Up for Audacity Dance Club</Text>
        <FontAwesome
          name="chevron-right"
          size={20}
          color="black"
          style={styles.arrow}
        />
      </Pressable>
      <View style={styles.divider} />
      <View style={[styles.card, styles.last]}>
        <Ionicons name="gift" size={18} color="black" style={styles.icon} />
        <Text style={styles.text}>Donate to admin@funyouth.us on Zelle</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderColor: "#e0e0e0",
    borderWidth: 1,
  },
  first: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  last: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: "#555",
  },
  arrow: {
    width: 20,
    height: 20,
  },
  divider: {
    height: 0.1,
    backgroundColor: "#e0e0e0",
  },
});
