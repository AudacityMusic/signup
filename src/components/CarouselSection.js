import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";
import Carousel from "react-native-reanimated-carousel";

import { formatDate } from "../utils";
import Heading from "./Heading";
import RefreshButton from "./RefreshButton";
import VolunteerOpportunity from "./VolunteerOpportunity";

export default function CarouselSection({ navigation, data, onRefresh }) {
  const [dotIndex, setDotIndex] = useState(0);
  const renderItem = ({ item }) => {
    return (
      <View>
        {item.map((component, index) => {
          return (
            <VolunteerOpportunity
              navigation={navigation}
              title={component.Title}
              location={component.Location}
              date={formatDate(component.Date)}
              image={component.Image}
              description={component.Description ?? ""}
              tags={
                component.Tags == null
                  ? []
                  : component.Tags.split(",")
                      .map((str) => str.trim())
                      .filter((str) => str.length > 0)
              }
              formURL={component["Form Link"] ?? null}
              isSubmitted={component.isSubmitted}
              key={index}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View>
      <View style={styles.heading}>
        <Heading>Volunteer Opportunities</Heading>
        <RefreshButton onRefresh={onRefresh} />
      </View>
      <Carousel
        width={Dimensions.get("window").width - 20}
        height={280}
        data={data}
        renderItem={renderItem}
        onSnapToItem={(index) => setDotIndex(index)}
      />
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
