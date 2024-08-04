import "@expo/metro-runtime";
import { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "./src/constants/colors";
import HomeScreen from "./src/screens/HomeScreen";
import AccountScreen from "./src/screens/AccountScreen";
import SignInScreen from "./src/screens/SignInScreen";
import VolunteerFormScreen from "./src/screens/VolunteerFormScreen";
import EmbeddedFormScreen from "./src/screens/EmbeddedFormScreen";
import VolunteerOpportunityScreen from "./src/screens/VolunteerOpportunityScreen";
import HomeHeader from "./src/components/HomeHeader";
import EndScreen from "./src/screens/EndScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        setIsLoggedIn(userString != null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  });

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName={isLoggedIn ? "Home" : "Sign Up"}
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      >
        <Stack.Screen
          name="Sign In"
          component={SignInScreen}
          options={{
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            header: (props) => <HomeHeader {...props} />,
          }}
        />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen
          name="Volunteer Opportunity"
          component={VolunteerOpportunityScreen}
          options={{
            title: null,
            headerStyle: {
              backgroundColor: colors.black,
            },
          }}
        />
        <Stack.Screen name="Volunteer Form" component={VolunteerFormScreen} />
        <Stack.Screen name="Google Forms" component={EmbeddedFormScreen} />
        <Stack.Screen name="Form End" component={EndScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
