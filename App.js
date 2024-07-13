import "@expo/metro-runtime";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/HomeScreen";
// import SignInScreen from "./src/screens/SignInScreen";
import DonateScreen from "./src/screens/DonateScreen";
import WebsitesScreen from "./src/screens/WebsitesScreen";
import VolunteerFormScreen from "./src/screens/VolunteerFormScreen";

import VolunteerOpportunityScreen from "./src/screens/VolunteerOpportunityScreen";
import OtherInfoScreen from "./src/screens/OtherInfoScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
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
  );
}
