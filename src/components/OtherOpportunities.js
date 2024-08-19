import { View, Text, StyleSheet, Image, Pressable, Alert } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function OtherOpportunities() {
  return (
    <View style={styles.cardContainer}>
      <Pressable
        style={[styles.card, styles.first]}
        onPress={() =>
          Alert.alert(
            "Request a Concert is not available yet. Please check back soon for more updates!",
          )
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
      <View style={styles.divider} />
      <View style={[styles.card, styles.last]}>
        <Ionicons name="gift" size={18} color="black" style={styles.icon} />
        <Text style={styles.text}>Donate to admin@funyouth.us on Zelle</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
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
