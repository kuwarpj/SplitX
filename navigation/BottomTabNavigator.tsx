import { HapticTab } from "@/components/HapticTab";
import AccountScreen from "@/screens/AccountScreen";
import ActivityScreen from "@/screens/ActivityScreen";
import GroupsScreen from "@/screens/GroupScreen";
import HomeScreen from "@/screens/HomeScreen";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
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
        tabBarActiveTintColor: "hsl(218, 100%, 22%)",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Tab.Screen
        name="Group"
        component={GroupsScreen}
        options={{
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
    </Tab.Navigator>
  );
}
