import {useState, useEffect} from 'react'
import { StyleSheet, ScrollView } from "react-native";
import OtherOpportunities from "../components/OtherOpportunities";
import Heading from "../components/Heading";
import Websites from "../components/Websites";
import CarouselPage from "../components/CarouselPage";
import { PublicGoogleSheetsParser } from '../components/PublicGoogleSheetsParser';

export default function HomeScreen({ navigation }) {
  console.log("Switched");

  function formatData(data) {
    let formattedArray = [];
    let tempArray = [];

    for (let i = 0; i < data.length; i++) {
      tempArray.push(data[i]);

      if (tempArray.length === 3) {
        formattedArray.push(tempArray);
        tempArray = [];
      }
    }

    if (tempArray.length > 0) {
      formattedArray.push(tempArray);
    }

    return formattedArray;
  }

  const [data, setData] = useState([]);

  useEffect(() => {
    const parser = new PublicGoogleSheetsParser(process.env.EXPO_PUBLIC_SHEET_ID, { sheetName: process.env.EXPO_PUBLIC_SHEET_NAME, useFormat: true });
    parser.parse().then(data => {setData(data);});
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