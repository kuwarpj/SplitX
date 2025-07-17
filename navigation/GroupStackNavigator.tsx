import CreateGroup from "@/screens/CreateGroup";
import GroupDetailsScreen from "@/screens/GroupDetailsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddExpenseScreen from "@/screens/AddExpense";
import GroupsScreen from "@/screens/GroupScreen";
const GroupStack = createNativeStackNavigator();

export default function GroupStackNavigator() {
  return (
    <GroupStack.Navigator screenOptions={{ headerShown: false }}>
      <GroupStack.Screen name="GroupScreen" component={GroupsScreen} />
      <GroupStack.Screen name="GroupDetails" component={GroupDetailsScreen} />
      <GroupStack.Screen name="AddExpense" component={AddExpenseScreen} />
      <GroupStack.Screen name="CreateGroup" component={CreateGroup} />
    </GroupStack.Navigator>
  );
}
