import React from "react";
import { Text, View, Image} from "react-native";

export default function BackButton() {
    return (
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <Text>{"\n\n\n"}</Text>
        <Image source={require("./../assets/caret-left.png")} />
        <Text style={{fontWeight: "bold", fontSize: 25}}>Back</Text>
      </View>
    );
}