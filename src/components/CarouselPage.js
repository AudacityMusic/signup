import { StyleSheet, Text, View, Image } from "react-native";
import colors from "../constants/colors";
import VolunteerOpportunity from "./VolunteerOpportunity";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";
import { useState } from "react";

export default function CarouselPage({ navigation, data }) {
  const [dotIndex, setDotIndex] = useState(0);
  const renderItem = ({ item }) => {
    return (
      <View>
        {item.map((thing) => {
          return (
            <VolunteerOpportunity
              navigation={navigation}
              title={thing.title}
              location={thing.location}
              time={thing.time}
            />
          );
        })}
      </View>
    );
  };
  return (
    <View>
      <Carousel
        width={400}
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
});
