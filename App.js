import "@expo/metro-runtime";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "./src/constants/colors";
import HomeScreen from "./src/screens/HomeScreen";
import AccountScreen from "./src/screens/AccountScreen";
import SignInScreen, {getUser} from "./src/screens/SignInScreen";
import DonateScreen from "./src/screens/DonateScreen";
import WebsitesScreen from "./src/screens/WebsitesScreen";
import VolunteerFormScreen from "./src/screens/VolunteerFormScreen";
import VolunteerOpportunityScreen from "./src/screens/VolunteerOpportunityScreen";
import HomeHeader from "./src/components/HomeHeader";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // try {
  //   const [user, setUser] = useState(JSON.parse("{}"));

  //   useEffect(() => {
  //     async function asynchronouslyGetUser() {
  //       return await getUser();
  //     }
  //     asynchronouslyGetUser().then(setUser);
  //   }, []);
  
  //   console.log(JSON.stringify(user));
  //   setLoggedIn(true);
  // }

  // catch (error) {
  // }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName={loggedIn ? "Home" : "Signin"}
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      >
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            header: (props) => <HomeHeader {...props} />,
          }}
        />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="Donate" component={DonateScreen} />
        <Stack.Screen name="Websites" component={WebsitesScreen} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
