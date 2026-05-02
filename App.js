/**
 * App.js
 * The main entry point of the Audacity Sign Up app.
 * - Initializes user authentication state from AsyncStorage
 * - Displays a loading indicator until auth status is resolved
 * - Sets up React Navigation stack with screens for Sign In, Home, Account, and volunteer flows
 */

import "@expo/metro-runtime";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import EmbeddedFormScreen from "./src/screens/EmbeddedFormScreen";
import EndScreen from "./src/screens/EndScreen";
import HomeScreen from "./src/screens/HomeScreen";
import VolunteerFormScreen from "./src/screens/VolunteerFormScreen";
import VolunteerOpportunityScreen from "./src/screens/VolunteerOpportunityScreen";

import HomeHeader from "./src/components/HomeHeader";
import NoInternetBanner from "./src/components/NoInternetBanner";
import colors from "./src/constants/colors";
import { navigationRef } from "./src/utils";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <NavigationContainer ref={navigationRef}>
          <StatusBar style="light" />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: { backgroundColor: colors.primary },
              headerTintColor: colors.white,
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ header: (props) => <HomeHeader {...props} /> }}
            />
            <Stack.Screen
              name="Volunteer Opportunity"
              component={VolunteerOpportunityScreen}
              options={{
                title: null,
                headerStyle: { backgroundColor: colors.black },
              }}
            />
            <Stack.Screen name="Sign Up Form" component={VolunteerFormScreen} />
            <Stack.Screen name="Google Forms" component={EmbeddedFormScreen} />
            <Stack.Screen
              name="End"
              component={EndScreen}
              options={{ title: null, headerBackVisible: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <NoInternetBanner />
      </View>
    </GestureHandlerRootView>
  );
}
