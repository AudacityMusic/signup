/**
 * RefreshButton.js
 * Animated refresh control button.
 * Props:
 *  - onRefresh: async function that reloads data and returns number of items
 */

import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { Alert, Animated, Pressable } from "react-native";

export default function RefreshButton({ onRefresh }) {
  // Animated value for rotation interpolation
  const [rotation] = useState(new Animated.Value(0));

  const rotationTransform = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"], // two full rotations
  });

  return (
    <Pressable
      onPress={() => {
        // Trigger data reload and show alert upon completion
        onRefresh().then((length) => {
          if (length != null) {
            Alert.alert(`Refreshed ${length} volunteer opportunities!`);
          }
        });
        // Start rotation animation
        Animated.timing(rotation, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }).start(() => rotation.setValue(0));
      }}
    >
      <Animated.View style={{ transform: [{ rotate: rotationTransform }] }}>
        {/* Refresh icon */}
        <Feather name="refresh-cw" size={22} color="black" />
      </Animated.View>
    </Pressable>
  );
}
