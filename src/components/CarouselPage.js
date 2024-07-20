import { StyleSheet, Text, View, Image } from "react-native";
import colors from "../constants/colors";
import VolunteerOpportunity from "./VolunteerOpportunity";
import Carousel from "react-native-reanimated-carousel";



export default function CarouselPage({ navigation,data }) {
  const renderItem =({item})=> {
    return (
      <View>
        <VolunteerOpportunity navigation={navigation} title={item[0].title} location={item[0].location} time={item[0].time} />
        <VolunteerOpportunity navigation={navigation} title={item[1].title} location={item[1].location} time={item[1].time} />
        <VolunteerOpportunity navigation={navigation} title={item[2].title} location={item[2].location} time={item[2].time} />

      </View>
    );
  }
  return (
    <View>
      <Carousel
        width={400}
        height={375}
        data={data}
        renderItem={renderItem}
      />
      <Text>Hi</Text>
    </View>
    
  );
}

const styles = StyleSheet.create({

});
