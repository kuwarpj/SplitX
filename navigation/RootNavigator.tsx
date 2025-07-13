import SignupScreen from "@/screens/SignUpScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="signup" component={SignupScreen} />
      
    </Stack.Navigator>
  );
}
