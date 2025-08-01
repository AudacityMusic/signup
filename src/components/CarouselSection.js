/**
 * CarouselSection.js
 * Displays a horizontal carousel of event rows with pagination.
 * Props:
 *  - navigation: React Navigation object for navigating to detail screens.
 *  - data: Array of rows, each a list of up to 3 event objects.
 *  - onRefresh: Callback to reload event data (pull-to-refresh).
 */

import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";
import Carousel from "react-native-reanimated-carousel";

import { formatDate } from "../utils";
import Heading from "./Heading";
import RefreshButton from "./RefreshButton";
import VolunteerOpportunity from "./VolunteerOpportunity";

export default function CarouselSection({ navigation, data, onRefresh }) {
  // Current index of active carousel slide for dots indicator
  const [dotIndex, setDotIndex] = useState(0);

  /**
   * Renders one page of the carousel (one row of up to 3 events)
   */
  const renderItem = ({ item }) => {
    return (
      <View>
        {item.map((event, index) => {
          // Render a card for each event
          return (
            <VolunteerOpportunity
              navigation={navigation}
              title={event.Title}
              location={event.Location}
              date={formatDate(event.Date)}
              image={event.Image}
              description={event.Description ?? ""}
              tags={
                event.Tags == null
                  ? []
                  : event.Tags.split(",")
                      .map((str) => str.trim())
                      .filter((str) => str.length > 0)
              }
              formURL={event["Form Link"] ?? null}
              isSubmitted={event.isSubmitted}
              max={event.Max}
              signedUp={event["Signed Up"]}
              key={index}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View>
      {/* Header with title and refresh control */}
      <View style={styles.heading}>
        <Heading>Volunteer Opportunities</Heading>
        <RefreshButton onRefresh={onRefresh} />
      </View>

      {/* Animated carousel of event rows */}
      <Carousel
        width={Dimensions.get("window").width - 20}
        height={280}
        data={data}
        renderItem={renderItem}
        onSnapToItem={(index) => setDotIndex(index)}
      />

      {/* Pagination dots below carousel */}
      <View style={styles.container}>
        <AnimatedDotsCarousel
          length={data.length}
          currentIndex={dotIndex}
          maxIndicators={3}
          activeIndicatorConfig={{
            color: "black",
            margin: 3,
            opacity: 1,
            size: 8,
          }}
          inactiveIndicatorConfig={{
            color: "grey",
            margin: 3,
            opacity: 0.5,
            size: 8,
          }}
          decreasingDots={[
            {
              config: { color: "#b8b6b6", margin: 3, opacity: 0.5, size: 6 },
              quantity: 1,
            },
            {
              config: { color: "#b8b6b6", margin: 3, opacity: 0.5, size: 4 },
              quantity: 1,
            },
          ]}
        />
      </View>
    </View>
  );
}

// Styles for CarouselSection
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: "5%",
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
