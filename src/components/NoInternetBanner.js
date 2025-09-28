/**
 * NoInternetBanner.js
 * A popup banner that appears when there's no internet connection
 * - Monitors network state using NetInfo
 * - Shows/hides with smooth animation
 * - Positioned at top of screen with overlay
 */

import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";

const NoInternetBanner = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isConnected) {
      // Slide down animation
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      // Slide up animation
      Animated.spring(slideAnim, {
        toValue: -100,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [isConnected, slideAnim]);

  return (
    <Animated.View
      style={[styles.banner, { transform: [{ translateY: slideAnim }] }]}
    >
      <View style={styles.content}>
        <Text style={styles.text}>📡 No Internet Connection</Text>
        <Text style={styles.subtext}>Please check your network settings</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.danger,
    paddingTop: 50, // Account for status bar
    paddingBottom: 15,
    paddingHorizontal: 20,
    zIndex: 9999,
    elevation: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  content: {
    alignItems: "center",
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtext: {
    color: colors.white,
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
    opacity: 0.9,
  },
});

export default NoInternetBanner;
