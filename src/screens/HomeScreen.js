import { StyleSheet, ScrollView } from "react-native";
import VolunteerOpportunity from "../components/VolunteerOpportunity";
import OtherOpportunities from "../components/OtherOpportunities";
import Heading from "../components/Heading";
import Websites from "../components/Websites";
import CarouselPage from "../components/CarouselPage";

export default function HomeScreen({ navigation }) {
  console.log("Switched");
  function formatData(data) {
    let count = 0;
    let formattedArray = [];
    let tempArray = [];
    for (let i = 0; i < data.length; i++) {
      tempArray.push(data[i]);
      if (tempArray.length === 3) {
        formattedArray.push(tempArray);
        tempArray = [];
      }
    }
    return formattedArray;
  }
  const testData = [
    {
      title: "Library Music Hour1",
      location: "Fremont Main Libary",
      time: "Saturday, August 10, 2024 2:30 PM",
      imagePath: "./../assets/warm-springs-bart.png",
    },
    {
      title: "Library Music Hour2",
      location: "Fremont Main Libary",
      time: "Saturday, August 10, 2024 2:30 PM",
      imagePath: "./../assets/warm-springs-bart.png",
    },
    {
      title: "Library Music Hour3",
      location: "Fremont Main Libary",
      time: "Saturday, August 10, 2024 2:30 PM",
      imagePath: "./../assets/warm-springs-bart.png",
    },
    {
      title: "Library Music Hour4",
      location: "Fremont Main Libary",
      time: "Saturday, August 10, 2024 2:30 PM",
      imagePath: "./../assets/warm-springs-bart.png",
    },
    {
      title: "Library Music Hour5",
      location: "Fremont Main Libary",
      time: "Saturday, August 10, 2024 2:30 PM",
      imagePath: "./../assets/warm-springs-bart.png",
    },
    {
      title: "Library Music Hour6",
      location: "Fremont Main Libary",
      time: "Saturday, August 10, 2024 2:30 PM",
      imagePath: "./../assets/warm-springs-bart.png",
    },
    {
      title: "Library Music Hour7",
      location: "Fremont Main Libary",
      time: "Saturday, August 10, 2024 2:30 PM",
      imagePath: "./../assets/warm-springs-bart.png",
    },
    {
      title: "Library Music Hour8",
      location: "Fremont Main Libary",
      time: "Saturday, August 10, 2024 2:30 PM",
      imagePath: "./../assets/warm-springs-bart.png",
    },
    {
      title: "Library Music Hour9",
      location: "Fremont Main Libary",
      time: "Saturday, August 10, 2024 2:30 PM",
      imagePath: "./../assets/warm-springs-bart.png",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Heading>Volunteer Opportunities</Heading>
      <CarouselPage navigation={navigation} data={formatData(testData)} />
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