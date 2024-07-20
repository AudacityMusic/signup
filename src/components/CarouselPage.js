import { StyleSheet, Text, View, Image } from "react-native";
import colors from "../constants/colors";
import VolunteerOpportunity from "./VolunteerOpportunity";
import Carousel from "react-native-snap-carousel";



export default function CarouselPage({ navigation,data }) {
  const renderItem =({item})=> {
    return (
      <View>
        <VolunteerOpportunity navigation={navigation} title={item.title} location={item.location} time={item.time} />
      </View>
    );
  }
  return (
    <Carousel
      data={data}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({

});
