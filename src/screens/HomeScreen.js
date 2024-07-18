import { StyleSheet, View } from "react-native";
import VolunteerOpportunity from "../components/VolunteerOpportunity";
import OtherOpportunities from "../components/OtherOpportunities";
import Heading from "../components/Heading";
import Websites from "../components/Websites";

export default function HomeScreen({ navigation }) {
  console.log("Switched");
  
  return (
    <View style={styles.container}>
      <Heading>Volunteer Opportunities</Heading>
      <VolunteerOpportunity navigation={navigation} />
      <VolunteerOpportunity navigation={navigation} />
      <VolunteerOpportunity navigation={navigation} />
      <Heading>Other Opportunities</Heading>
      <OtherOpportunities />
      <Heading>Websites</Heading>
      <Websites />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
});
