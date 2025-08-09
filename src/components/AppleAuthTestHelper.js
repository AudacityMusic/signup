/**
 * AppleAuthTestHelper.js
 * Development utility to test and debug Apple authentication data
 * Add this component temporarily to any screen for testing
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import FullWidthButton from "./FullWidthButton";
import { getAppleUserData, clearAppleUserData, updateAppleUserData } from "../utils";

export default function AppleAuthTestHelper() {
  const [debugInfo, setDebugInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const loadDebugInfo = async () => {
    setIsLoading(true);
    try {
      const currentUser = await AsyncStorage.getItem("user");
      const appleUserData = await getAppleUserData();
      const accessToken = await AsyncStorage.getItem("access-token");

      setDebugInfo({
        currentUser: currentUser ? JSON.parse(currentUser) : null,
        appleUserData,
        accessToken,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setDebugInfo({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testUpdateProfile = async () => {
    const success = await updateAppleUserData({
      name: "Test User " + Date.now(),
      email: `test${Date.now()}@example.com`,
    });
    console.log("Update result:", success);
    loadDebugInfo(); // Refresh data
  };

  const clearAllData = async () => {
    await AsyncStorage.clear();
    await clearAppleUserData();
    setDebugInfo({});
    console.log("All data cleared");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Apple Auth Test Helper</Text>
      
      <FullWidthButton
        buttonStyle={styles.button}
        textStyle={styles.buttonText}
        onPress={loadDebugInfo}
      >
        {isLoading ? "Loading..." : "Load Debug Info"}
      </FullWidthButton>

      <FullWidthButton
        buttonStyle={[styles.button, styles.testButton]}
        textStyle={styles.buttonText}
        onPress={testUpdateProfile}
      >
        Test Profile Update
      </FullWidthButton>

      <FullWidthButton
        buttonStyle={[styles.button, styles.dangerButton]}
        textStyle={styles.buttonText}
        onPress={clearAllData}
      >
        Clear All Data
      </FullWidthButton>

      <ScrollView style={styles.debugOutput}>
        <Text style={styles.debugTitle}>Debug Information:</Text>
        <Text style={styles.debugText}>
          {JSON.stringify(debugInfo, null, 2)}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    margin: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
  },
  testButton: {
    backgroundColor: "#34C759",
  },
  dangerButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  debugOutput: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
    maxHeight: 300,
    marginTop: 16,
  },
  debugTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 8,
  },
  debugText: {
    color: "#00FF00",
    fontFamily: "monospace",
    fontSize: 12,
  },
});
