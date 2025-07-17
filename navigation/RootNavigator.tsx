import { useApp } from "@/context/AppContext";
import AddExpense from "@/screens/AddExpense";
import LoginScreen from "@/screens/LoginScreen";
import NotificationsScreen from "@/screens/NotificationScreen";
import SignupScreen from "@/screens/SignUpScreen";
import SplashScreen from "@/screens/SplashScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isLoggedIn, loading } = useApp();

  if (loading) {
    return <SplashScreen />; // Show splash during initialization
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen name="Notification" component={NotificationsScreen} />
          <Stack.Screen name="AddExpense" component={AddExpense} />

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
