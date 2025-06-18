import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import CarouselSection from "../components/CarouselSection";
import Heading from "../components/Heading";
import OtherOpportunities from "../components/OtherOpportunities";
import PersistScrollView from "../components/PersistScrollView";
import Websites from "../components/Websites";

import {
  alertError,
  formatDate,
  getUser,
  hashForm,
  request,
  strToDate,
} from "../utils";
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

    const unparsedData = await request(() => parser.parse());
    if (unparsedData == null) {
      return null;
    }
    const newData = [];
    const user = await getUser();

    const currentDate = new Date();

    const twoMonthsLater = new Date();
    twoMonthsLater.setMonth(currentDate.getMonth() + 2);

    for (let i = 0; i < unparsedData.length; i++) {
      const opportunity = unparsedData[i];
      opportunity.Title ??= "Untitled Event";
      opportunity.Location ??= "Unknown Location";
      opportunity.Date = strToDate(opportunity.Date) ?? new Date(0);

      const event_midnight = new Date(opportunity.Date);
      event_midnight.setHours(23, 59, 59, 999);

      if (event_midnight < currentDate || opportunity.Date > twoMonthsLater) {
        continue;
      }
      const hash = hashForm(
        user.id,
        opportunity.Title,
        opportunity.Location,
        formatDate(opportunity.Date),
      );
      opportunity.isSubmitted = submittedForms.includes(hash);
      newData.push(opportunity);
    }

    newData.sort((a, b) => a.Date - b.Date);
    setData(newData);

    return newData.length;
  }

  useEffect(() => {
    onRefresh();
  }, [route]);

  return (
    <PersistScrollView>
      <View style={styles.container}>
        <CarouselSection
          navigation={navigation}
          data={formatData(data)}
          onRefresh={onRefresh}
        />
        <Heading>Other Opportunities</Heading>
        <OtherOpportunities navigation={navigation} />
        <Heading>Websites</Heading>
        <Websites />
      </View>
    </PersistScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
});
