import { StyleSheet, Text, View, Image } from "react-native";
import colors from "../constants/colors";
import VolunteerOpportunity from "./VolunteerOpportunity";
import Carousel from "react-native-reanimated-carousel";

export default function CarouselPage({ navigation, data }) {
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
              image={component.Image}
              description={component.Description}
              tags={component.Tags.split(", ")}
              key={index}
            />
          );
        })}
      </View>
    );
  };
  return (
    <Carousel width={400} height={300} data={data} renderItem={renderItem} />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: "5%",
  },
});