import { StyleSheet, ScrollView } from "react-native";
import VolunteerOpportunity from "../components/VolunteerOpportunity";
import OtherOpportunities from "../components/OtherOpportunities";
import Heading from "../components/Heading";
import Websites from "../components/Websites";
import Carousel from "react-native-snap-carousel";
import CarouselPage from "../components/CarouselPage";

export default function HomeScreen({ navigation }) {
  const testData = [
    {title: "Library Music Hour", location: "Fremont Main Libary", time: "Saturday, August 10, 2024 2:30 PM", imagePath: "./../assets/warm-springs-bart.png"},
    {title: "Library Music Hour", location: "Fremont Main Libary", time: "Saturday, August 10, 2024 2:30 PM", imagePath: "./../assets/warm-springs-bart.png"},
    {title: "Library Music Hour", location: "Fremont Main Libary", time: "Saturday, August 10, 2024 2:30 PM", imagePath: "./../assets/warm-springs-bart.png"},
    
  
  ];

  return (
    <ScrollView style={styles.container}>
      <Heading>Volunteer Opportunities</Heading>
      <CarouselPage navigation={navigation} data={testData}/>
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
