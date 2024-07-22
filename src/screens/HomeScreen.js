import { StyleSheet, ScrollView } from "react-native";
import VolunteerOpportunity from "../components/VolunteerOpportunity";
import OtherOpportunities from "../components/OtherOpportunities";
import Heading from "../components/Heading";
import Websites from "../components/Websites";

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Heading>Volunteer Opportunities</Heading>
      <VolunteerOpportunity navigation={navigation} />
      <VolunteerOpportunity navigation={navigation} />
      <VolunteerOpportunity navigation={navigation} />
      <Heading>Other Opportunities</Heading>
      <OtherOpportunities />
      <Heading>Websites</Heading>
      <Websites />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
});
