import { useState, useEffect } from "react";
import { StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import OtherOpportunities from "../components/OtherOpportunities";
import Heading from "../components/Heading";
import Websites from "../components/Websites";
import CarouselPage from "../components/CarouselPage";

import { PublicGoogleSheetsParser } from "../utils/PublicGoogleSheetsParser";
import { hashForm } from "../utils";

export default function HomeScreen({ navigation, route }) {
  function formatData(data) {
    let formattedArray = [];
    let tempArray = [];

    for (const opportunity of data) {
      const formattedDate = formatDate(opportunity.Date);
      if (formattedDate == null) {
        continue;
      }
      opportunity.Date = formattedDate;
      tempArray.push(opportunity);

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

  function formatDate(dateString) {
    const [year, month, day, hour, minute, second] = dateString
      .slice(5, -1)
      .split(",")
      .map(Number);

    const date = new Date(year, month, day, hour, minute, second);

    if (new Date() > date) {
      return null;
    }

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const h = hour % 12 == 0 ? 12 : hour % 12;
    const m = (minute < 10 ? "0" : "") + minute;
    const period = hour >= 12 ? "PM" : "AM";
    return `${days[date.getDay()]}, ${months[month]} ${day}, ${year} ${h}:${m} ${period}`;
  }

  const [data, setData] = useState([]);

  async function onRefresh() {
    const parser = new PublicGoogleSheetsParser(
      process.env.EXPO_PUBLIC_SHEET_ID,
      { sheetName: process.env.EXPO_PUBLIC_SHEET_NAME },
    );

    const submittedForms = [];
    try {
      const storedForms = await AsyncStorage.getItem("submittedForms");
      if (storedForms != null) {
        submittedForms.push(...JSON.parse(storedForms));
      }
    } catch (error) {
      console.error(error);
    }

    parser.parse().then((data) => {
      for (const opportunity of data) {
        const hash = hashForm(
          opportunity.Title,
          opportunity.Location,
          formatDate(opportunity.Date),
        );
        opportunity.isSubmitted = submittedForms.includes(hash);
      }
      setData(data);
    });
  }

  useEffect(() => {
    onRefresh();
  }, []);

  if (route?.params?.shouldRefresh) {
    onRefresh();
  }

  return (
    <ScrollView style={styles.container}>
      <CarouselPage
        navigation={navigation}
        data={formatData(data)}
        onRefresh={onRefresh}
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
