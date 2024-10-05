import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { Alert, Animated, Pressable } from "react-native";

export default function RefreshButton({ onRefresh }) {
  const [rotation, _] = useState(new Animated.Value(0));

  const rotationTransform = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"],
  });

  return (
    <Pressable
      onPress={() => {
        onRefresh().then((length) =>
          Alert.alert(`Refreshed ${length} volunteer opportunities!`),
        );
        Animated.timing(rotation, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }).start(() => {
          rotation.setValue(0);
        });
      }}
    >
      <Animated.View style={{ transform: [{ rotate: rotationTransform }] }}>
        <Feather name="refresh-cw" size={22} color="black" />
      </Animated.View>
    </Pressable>
  );
}
