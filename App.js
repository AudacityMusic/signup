import "@expo/metro-runtime";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import AccountScreen from "./src/screens/AccountScreen";
import EmbeddedFormScreen from "./src/screens/EmbeddedFormScreen";
import EndScreen from "./src/screens/EndScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SignInScreen from "./src/screens/SignInScreen";
import VolunteerFormScreen from "./src/screens/VolunteerFormScreen";
import VolunteerOpportunityScreen from "./src/screens/VolunteerOpportunityScreen";

import HomeHeader from "./src/components/HomeHeader";
import colors from "./src/constants/colors";
import { alertError } from "./src/utils";

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
        alertError(`While getting user in App: ${error}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName={isLoggedIn ? "Home" : "Sign In"}
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
        <Stack.Screen
          name="Account"
          component={AccountScreen}
          options={{ animation: "slide_from_bottom" }}
        />
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
        <Stack.Screen
          name="End"
          component={EndScreen}
          options={{
            title: null,
            headerBackVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
