import "@expo/metro-runtime";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import colors from "./src/constants/colors";
import HomeScreen from "./src/screens/HomeScreen";
<<<<<<< HEAD
=======
import AccountScreen from "./src/screens/AccountScreen";
>>>>>>> origin
// import SignInScreen from "./src/screens/SignInScreen";
import DonateScreen from "./src/screens/DonateScreen";
import WebsitesScreen from "./src/screens/WebsitesScreen";
import VolunteerFormScreen from "./src/screens/VolunteerFormScreen";
import VolunteerOpportunityScreen from "./src/screens/VolunteerOpportunityScreen";
import OtherInfoScreen from "./src/screens/OtherInfoScreen";
import HomeHeader from "./src/components/HomeHeader";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
<<<<<<< HEAD
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Other Info">
    //     <Stack.Screen name="Home" component={HomeScreen} />
    //     <Stack.Screen name="Donate" component={DonateScreen} />
    //     <Stack.Screen name="Websites" component={WebsitesScreen} />
    //     <Stack.Screen name="Other Info" component={OtherInfoScreen} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    // <SignInScreen></SignInScreen>
    // <OtherInfoScreen></OtherInfoScreen>
    <VolunteerFormScreen></VolunteerFormScreen>
=======
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      >
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
        <Stack.Screen name="Other Info" component={OtherInfoScreen} />
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
>>>>>>> origin
  );
}
