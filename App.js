import "@expo/metro-runtime";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import colors from "./src/constants/colors";
import HomeScreen from "./src/screens/HomeScreen";
import AccountScreen from "./src/screens/AccountScreen";
import SignInScreen from "./src/screens/SignInScreen";
import VolunteerFormScreen from "./src/screens/VolunteerFormScreen";
import EmbeddedFormScreen from "./src/screens/EmbeddedFormScreen";
import VolunteerOpportunityScreen from "./src/screens/VolunteerOpportunityScreen";
import HomeHeader from "./src/components/HomeHeader";
import NoInternetBanner from "./src/components/NoInternetBanner";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

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

    // New useEffect for NetInfo
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        {!isConnected && <NoInternetBanner />}
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
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}
