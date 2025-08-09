import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Animated } from "react-native";
// @ts-ignore: missing type declarations for NetInfo
import NetInfo from "@react-native-community/netinfo";

const NoWifiBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const slideAnim = new Animated.Value(-50);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.type !== "wifi" || !state.isConnected) {
        setShowBanner(true);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowBanner(false);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  if (!showBanner) return null;

  return (
    <Animated.View
      style={[styles.banner, { transform: [{ translateY: slideAnim }] }]}
    >
      <Text style={styles.bannerText}>No WiFi Connection</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "#ff0000",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  bannerText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default NoWifiBanner;
