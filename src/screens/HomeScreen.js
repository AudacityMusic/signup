import { useState, useEffect } from "react";
import { StyleSheet, ScrollView } from "react-native";

import OtherOpportunities from "../components/OtherOpportunities";
import Heading from "../components/Heading";
import Websites from "../components/Websites";
import CarouselPage from "../components/CarouselPage";

import { PublicGoogleSheetsParser } from "../utils/PublicGoogleSheetsParser";

export default function HomeScreen({ navigation }) {
  function formatData(data) {
    let formattedArray = [];
    let tempArray = [];

    for (const component of data) {
      const [year, month, day, hour, minute, second] = component.Date.slice(5, -1).split(',').map(Number);
      const date = new Date(year, month, day, hour, minute, second);

      if (new Date() < date) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
        component.Date = days[date.getDay()] + ", " + months[month] + " " + day + ", " + year + " " + (hour % 12 == 0 ? 12 : hour % 12) + ":" + (minute < 10 ? "0" : "") + minute + " " + (hour >= 12 ? "PM" : "AM");
        tempArray.push(component);

        if (tempArray.length === 3) {
          formattedArray.push(tempArray);
          tempArray = [];
        }
      } 
    }

    if (tempArray.length > 0) {
      formattedArray.push(tempArray);
    }

    console.log(formattedArray);
    return formattedArray;
  }

  const [data, setData] = useState([]);

  useEffect(() => {
    const parser = new PublicGoogleSheetsParser(
      process.env.EXPO_PUBLIC_SHEET_ID,
      { sheetName: process.env.EXPO_PUBLIC_SHEET_NAME },
    );
    parser.parse().then((data) => {
      setData(data);
    });
  }, []);

  console.log(JSON.stringify(data));

  return (
    <ScrollView style={styles.container}>
      <Heading>Volunteer Opportunities</Heading>
      <CarouselPage navigation={navigation} data={formatData(data)} />
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
