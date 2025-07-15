import { useApp } from "@/context/AppContext";
import AddExpenseScreen from "@/screens/AddExpense";
import CreateGroup from "@/screens/CreateGroup";
import GroupDetailsScreen from "@/screens/GroupDetailsScreen";
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
          <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
          <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
          <Stack.Screen name="CreateGroup" component={CreateGroup} />
          <Stack.Screen name="Notification" component={NotificationsScreen} />
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
