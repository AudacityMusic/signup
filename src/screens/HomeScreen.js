/**
 * HomeScreen.js
 * Main screen showing upcoming events in a carousel, plus extra resources.
 * - Fetches data from Google Sheets via PublicGoogleSheetsParser
 * - Filters events by date range and submission status
 * - Manages push notifications for each event
 */

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
import { EXPO_PUBLIC_SHEET_ID, EXPO_PUBLIC_SHEET_NAME } from "@env";
import {
  initNotificationHandling,
  scheduleEventNotifications,
  cancelAllScheduled,
} from "../utils/notifications";

/**
 * HomeScreen: displays upcoming events in a carousel, other opportunities, and websites.
 * - Fetches event data from Google Sheets
 * - Filters events by date range
 * - Manages notification scheduling for each event
 */
export default function HomeScreen({ navigation, route }) {
  // State: array of event objects
  const [data, setData] = useState([]);

  // Request notification permissions and set up channel on mount
  useEffect(() => {
    initNotificationHandling();
  }, []);

  // Whenever event data changes, clear and reschedule notifications
  useEffect(() => {
    cancelAllScheduled();
    (async () => {
      try {
        // Await all scheduled notifications to catch errors
        await Promise.all(
          data.map((event) => scheduleEventNotifications(event)),
        );
      } catch (err) {
        console.error("Failed to schedule notifications:", err);
      }
    })();
  }, [data]);

  /**
   * Group flat event list into rows of 3 for the carousel layout.
   * @param {Array} rawData - flat list of event objects
   * @returns {Array[]} array of rows, each an array of up to 3 events
   */
  function formatData(rawData) {
    const formatted = [];
    let row = [];
    rawData.forEach((item) => {
      row.push(item);
      if (row.length === 3) {
        formatted.push(row);
        row = [];
      }
    });
    if (row.length) formatted.push(row);
    return formatted;
  }

  /**
   * Fetch events from Google Sheets, filter by date and submission status,
   * then update state for display and scheduling.
   * @returns {Promise<number|null>} number of events loaded or null on failure
   */
  async function onRefresh() {
    const parser = new PublicGoogleSheetsParser(
      EXPO_PUBLIC_SHEET_ID || "1w8CEPFw3Qk1bFueetJDMGpRG_7c2L0O0nLKVmVjSH0g",
      {
        sheetName: EXPO_PUBLIC_SHEET_NAME || "DEV",
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

    // Fetch raw data with retry logic via request()
    const unparsedData = await request(() => parser.parse());
    if (unparsedData == null) {
      return null;
    }
    const newData = [];
    const user = await getUser();

    const currentDate = new Date();

    const twoMonthsLater = new Date();
    twoMonthsLater.setMonth(currentDate.getMonth() + 2);

    // Transform and filter each record:
    // - Provide default Title/Location
    // - Convert date string to Date
    // - Exclude past events and events beyond two months ahead
    // - Mark isSubmitted based on stored hashes
    // - Collect valid events

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

    // Sort events chronologically
    newData.sort((a, b) => a.Date - b.Date);

    // Update state to re-render and trigger scheduling
    setData(newData);

    // Return count for pull-to-refresh control
    return newData.length;
  }

  // Trigger data load on screen focus or route change
  useEffect(() => {
    onRefresh().catch((err) => console.error("Error refreshing events:", err));
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

// Styles for HomeScreen
const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
});
