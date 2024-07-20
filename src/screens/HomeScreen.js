import { StyleSheet, ScrollView } from "react-native";
import VolunteerOpportunity from "../components/VolunteerOpportunity";
import OtherOpportunities from "../components/OtherOpportunities";
import Heading from "../components/Heading";
import Websites from "../components/Websites";
import Carousel from "react-native-snap-carousel";
import CarouselPage from "../components/CarouselPage";

export default function HomeScreen({ navigation }) {
  console.log("Switched");

  return (
    <ScrollView style={styles.container}>
      <Heading>Volunteer Opportunities</Heading>
      <Carousel
        layout={"default"}
        renderItem={CarouselPage}
      />
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
