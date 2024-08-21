import { StyleSheet, Text, View, Image } from "react-native";
import colors from "../constants/colors";
import Feather from "@expo/vector-icons/Feather";

export default function SignUpButton() {
  return (
    <View>
      <Feather name="refresh-cw" size={22} color="black" />
    </View>
  );
}

const styles = StyleSheet.create({});
