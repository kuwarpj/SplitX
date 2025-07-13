import { useApp } from "@/context/AppContext";
import GroupDetailsScreen from "@/screens/GroupDetailsScreen";
import LoginScreen from "@/screens/LoginScreen";
import SignupScreen from "@/screens/SignUpScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isLoggedIn } = useApp();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
