import { HapticTab } from "@/components/HapticTab";
import { useApp } from "@/context/AppContext";
import AccountScreen from "@/screens/AccountScreen";
import ActivityScreen from "@/screens/ActivityScreen";
import AddExpenseScreen from "@/screens/AddExpense"; // Import the actual screen
import HomeScreen from "@/screens/HomeScreen";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity } from "react-native";
import GroupStackNavigator from "./GroupStackNavigator";

const Tab = createBottomTabNavigator();

// Custom Plus Button Component
function PlusButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.plusButton}
    >
      <Ionicons name="add" size={32} color="#fff" />
    </TouchableOpacity>
  );
}

export default function BottomTabNavigator() {
  const navigation = useNavigation();
  const { currentGroupId } = useApp();

  // console.log("This is Current Group id---->", currentGroupId);

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
        component={GroupStackNavigator}
        options={{
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />

      {/* Plus Button Tab */}
      <Tab.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{
          tabBarButton: () => (
            <PlusButton
              onPress={() => {
                navigation.navigate("AddExpense", { groupId: currentGroupId });
              }}
            />
          ),
          tabBarLabel: "", // Optional: remove label text
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

const styles = StyleSheet.create({
  plusButton: {
    backgroundColor: "hsl(218, 100%, 22%)",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: 20,
    bottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});
