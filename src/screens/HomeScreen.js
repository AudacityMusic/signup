import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import CarouselPage from "../components/CarouselPage";
import Heading from "../components/Heading";
import OtherOpportunities from "../components/OtherOpportunities";
import Websites from "../components/Websites";

import { alertError, hashForm, strToDate } from "../utils";
import PublicGoogleSheetsParser from "../utils/PublicGoogleSheetsParser";

export default function HomeScreen({ navigation, route }) {
  const [data, setData] = useState([]);

  function formatData(data) {
    let formattedArray = [];
    let tempArray = [];

    for (const opportunity of data) {
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

  async function onRefresh() {
    const parser = new PublicGoogleSheetsParser(
      process.env.EXPO_PUBLIC_SHEET_ID ??
        alertError("Undefined EXPO_PUBLIC_SHEET_ID env variable"),
      {
        sheetName:
          process.env.EXPO_PUBLIC_SHEET_NAME ??
          alertError("Undefined EXPO_PUBLIC_SHEET_NAME env variable"),
      },
    );

    const submittedForms = [];
    try {
      const storedForms = await AsyncStorage.getItem("submittedForms");
      if (storedForms != null) {
        submittedForms.push(...JSON.parse(storedForms));
      }
    } catch (error) {
      alertError("In onRefresh: " + error);
    }

    const unparsedData = await parser.parse();

    const newData = [];

    for (let i = 0; i < unparsedData.length; i++) {
      const opportunity = unparsedData[i];
      opportunity.Date = strToDate(opportunity.Date);
      if (opportunity.Date < new Date()) {
        continue;
      }
      const hash = hashForm(
        opportunity.Title,
        opportunity.Location,
        opportunity.Date,
      );
      opportunity.isSubmitted = submittedForms.includes(hash);
      if (!("Image" in opportunity)) {
        opportunity.Image = "https://placehold.co/600x400";
      }
      newData.push(opportunity);
    }

    newData.sort((a, b) => a.Date - b.Date);
    setData(newData);

    return newData.length;
  }

  useEffect(() => {
    onRefresh();
  }, []);

  if (route?.params?.shouldRefresh) {
    onRefresh();
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <CarouselPage
          navigation={navigation}
          data={formatData(data)}
          onRefresh={onRefresh}
        />
        <Heading>Other Opportunities</Heading>
        <OtherOpportunities navigation={navigation} />
        <Heading>Websites</Heading>
        <Websites />
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
});
