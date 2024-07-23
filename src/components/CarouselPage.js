import { StyleSheet, Text, View, Image } from "react-native";
import colors from "../constants/colors";
import VolunteerOpportunity from "./VolunteerOpportunity";
import Carousel from "react-native-reanimated-carousel";

export default function CarouselPage({ navigation, data }) {
  const renderItem = ({ item }) => {
    return (
      <View>
        <VolunteerOpportunity
          navigation={navigation}
          title={item[0].Title}
          location={item[0].Location}
          date={item[0].Date}
          image={item[0].Image}
          description={item[0].Description}
          tags={item[0].Tags.split(', ')}
        />
        {item.length > 1 ? <VolunteerOpportunity
          navigation={navigation}
          title={item[1].Title}
          location={item[1].Location}
          date={item[1].Date}
          image={item[1].Image}
          description={item[1].Description}
          tags={item[1].Tags.split(', ')}
        /> : null}
        {item.length > 2 ? <VolunteerOpportunity
          navigation={navigation}
          title={item[2].Title}
          location={item[2].Location}
          date={item[2].Date}
          image={item[2].Image}
          description={item[2].Description}
          tags={item[2].Tags.split(', ')}
        /> : null}
      </View>
    );
  };
  return (
    <Carousel width={400} height={300} data={data} renderItem={renderItem} />
  );
}

const styles = StyleSheet.create({});