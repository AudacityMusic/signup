import { useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";
import VolunteerOpportunity from "./VolunteerOpportunity";
import Carousel from "react-native-reanimated-carousel";
import Heading from "./Heading";
import RefreshButton from "./RefreshButton";

export default function CarouselPage({ navigation, data, onRefresh }) {
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
              date={component.Date}
              image={
                component.Image == undefined
                  ? "https://placehold.co/600x400"
                  : component.Image
              }
              description={
                component.Description == undefined ? "" : component.Description
              }
              tags={
                component.Tags == undefined
                  ? []
                  : component.Tags.split(",")
                      .map((str) => str.trim())
                      .filter((str) => str.length > 0)
              }
              formURL={
                component["Form Link"] == undefined
                  ? null
                  : component["Form Link"]
              }
              key={index}
            />
          );
        })}
      </View>
    );
  };
  const onPress = () => {
    onRefresh();
    Alert.alert("Refreshed!");
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Heading>Volunteer Opportunities</Heading>
        <Pressable onPress={onPress}>
          <RefreshButton />
        </Pressable>
      </View>
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
