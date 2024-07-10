import "@expo/metro-runtime";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/HomeScreen";
// import SignInScreen from "./src/screens/SignInScreen";
import DonateScreen from "./src/screens/DonateScreen";
import WebsitesScreen from "./src/screens/WebsitesScreen";
import PersonalInfoScreen from "./src/screens/PersonalInfoScreen";
import PerformanceDetailsScreen from "./src/screens/PerformanceDetailsScreen";
import VolunteerFormScreen from "./src/screens/VolunteerFormScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Home">
    //     <Stack.Screen name="Home" component={HomeScreen} />
    //     <Stack.Screen name="Sign In" component={SignInScreen} />
    //     <Stack.Screen name="Donate" component={DonateScreen} />
    //     <Stack.Screen name="Websites" component={WebsitesScreen} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    // <PersonalInfoScreen></PersonalInfoScreen>
    // <PerformanceDetailsScreen></PerformanceDetailsScreen>
    <VolunteerFormScreen></VolunteerFormScreen>
  );
}
