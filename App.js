/**
 * App.js
 * The main entry point of the Audacity Sign Up app.
 * - Initializes user authentication state from AsyncStorage
 * - Displays a loading indicator until auth status is resolved
 * - Sets up React Navigation stack with screens for Sign In, Home, Account, and volunteer flows
 */

import "@expo/metro-runtime";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import AccountScreen from "./src/screens/AccountScreen";
import EmbeddedFormScreen from "./src/screens/EmbeddedFormScreen";
import EndScreen from "./src/screens/EndScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SignInScreen from "./src/screens/SignInScreen";
import VolunteerFormScreen from "./src/screens/VolunteerFormScreen";
import VolunteerOpportunityScreen from "./src/screens/VolunteerOpportunityScreen";

import HomeHeader from "./src/components/HomeHeader";
import NoInternetBanner from "./src/components/NoInternetBanner";
import colors from "./src/constants/colors";
import { alertError } from "./src/utils";

const Stack = createNativeStackNavigator();

export default function App() {
  // Local state: loading indicator and logged-in status
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // On mount, retrieve user info to determine if already signed in
    (async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        setIsLoggedIn(userString != null);
      } catch (error) {
        // Alert on any errors retrieving user data
        alertError(`While getting user in App: ${error}`);
      } finally {
        // Hide loading spinner after check
        setLoading(false);
      }
    })();
  }, []);

  // initGlobalErrorReporting is not exported from ./src/utils; global error reporting is not initialized here.

  // Show a full-screen spinner while initializing app state
  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  // Once ready, render the navigation container with all screens
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        {/* Light-content status bar to match header styling */}
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName={isLoggedIn ? "Home" : "Sign In"}
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        >
          {/* Sign In screen for authentication */}
          <Stack.Screen
            name="Sign In"
            component={SignInScreen}
            options={{ headerBackVisible: false }}
          />
          {/* Main Home screen with custom header */}
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ header: (props) => <HomeHeader {...props} /> }}
          />
          {/* Account management screen */}
          <Stack.Screen
            name="Account"
            component={AccountScreen}
            options={{ animation: "slide_from_bottom" }}
          />
          {/* Detailed volunteer opportunity view */}
          <Stack.Screen
            name="Volunteer Opportunity"
            component={VolunteerOpportunityScreen}
            options={{
              title: null,
              headerStyle: { backgroundColor: colors.black },
            }}
          />
          {/* Form submission screen for events */}
          <Stack.Screen name="Sign Up Form" component={VolunteerFormScreen} />
          {/* Embedded Google Forms web view */}
          <Stack.Screen name="Google Forms" component={EmbeddedFormScreen} />
          {/* End screen showing submission success/failure */}
          <Stack.Screen
            name="End"
            component={EndScreen}
            options={{ title: null, headerBackVisible: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <NoInternetBanner />
    </View>
  );
}
