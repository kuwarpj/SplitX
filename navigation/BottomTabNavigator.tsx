import AccountScreen from "@/screens/AccountScreen";
import ActivityScreen from "@/screens/ActivityScreen";
import GroupScreen from "@/screens/GroupScreen";
import HomeScreen from "@/screens/HomeScreen";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // 👈 This disables header per tab screen
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

          switch (route.name) {
            case "Home":
              iconName = "home-outline";
              break;
            case "Group":
              iconName = "people-outline";
              break;
            case "Activity":
              iconName = "bar-chart-outline";
              break;
            case "Account":
              iconName = "person-outline";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Group" component={GroupScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}
