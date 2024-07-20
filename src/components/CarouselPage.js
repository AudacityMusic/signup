import { StyleSheet, Text, View, Image } from "react-native";
import colors from "../constants/colors";
import VolunteerOpportunity from "./VolunteerOpportunity";

export default function CarouselPage({ navigation }) {
  return (
    <View>
        <VolunteerOpportunity navigation={navigation} />
        <VolunteerOpportunity navigation={navigation} />
        <VolunteerOpportunity navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({

});
