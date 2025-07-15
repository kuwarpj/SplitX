// ActivityScreen.tsx (React Native Version with Pixel-Perfect Matching)
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { lightThemeColors as colors } from "../constants/Colors";
interface ActivityItem {
  id: string;
  type: "expense" | "payment" | "settlement";
  title: string;
  description: string;
  amount: number;
  yourShare: number; // positive = you owe, negative = you are owed, 0 = settled
  paidBy: {
    name: string;
    avatar: string;
  };
  splitBetween: Array<{
    name: string;
    avatar: string;
    amount: number;
  }>;
  group: {
    name: string;
    icon: string;
  };
  category: "food" | "travel" | "home" | "transport" | "shopping" | "general";
  date: string;
  timestamp: string;
  status: "pending" | "settled" | "partial";
}

if (Platform.OS === "android")
  UIManager.setLayoutAnimationEnabledExperimental?.(true);

const ActivityScreen = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const [activities] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "expense",
      title: "Italian Restaurant Dinner",
      description: "Dinner at Osteria Italiana",
      amount: 89.5,
      yourShare: 22.38,
      paidBy: { name: "Alex", avatar: "AJ" },
      splitBetween: [
        { name: "You", avatar: "YO", amount: 22.38 },
        { name: "Alex", avatar: "AJ", amount: 22.38 },
        { name: "Sarah", avatar: "SC", amount: 22.38 },
        { name: "Mike", avatar: "MR", amount: 22.36 },
      ],
      group: { name: "Dinner Club", icon: "🍽️" },
      category: "food",
      date: "Today",
      timestamp: "2:30 PM",
      status: "pending",
    },
    {
      id: "2",
      type: "payment",
      title: "Emma paid you back",
      description: "Coffee from yesterday",
      amount: 12.5,
      yourShare: -12.5,
      paidBy: { name: "Emma", avatar: "EW" },
      splitBetween: [
        { name: "You", avatar: "YO", amount: -12.5 },
        { name: "Emma", avatar: "EW", amount: 12.5 },
      ],
      group: { name: "Office Lunch", icon: "☕" },
      category: "food",
      date: "Today",
      timestamp: "11:15 AM",
      status: "settled",
    },
    {
      id: "3",
      type: "expense",
      title: "Uber to Airport",
      description: "Shared ride for weekend trip",
      amount: 45.0,
      yourShare: 11.25,
      paidBy: { name: "Mike", avatar: "MR" },
      splitBetween: [
        { name: "You", avatar: "YO", amount: 11.25 },
        { name: "Mike", avatar: "MR", amount: 11.25 },
        { name: "Lisa", avatar: "LB", amount: 11.25 },
        { name: "Tom", avatar: "TC", amount: 11.25 },
      ],
      group: { name: "Weekend Trip", icon: "✈️" },
      category: "transport",
      date: "Yesterday",
      timestamp: "6:45 AM",
      status: "pending",
    },
    {
      id: "4",
      type: "settlement",
      title: "Settled up with Sarah",
      description: "Multiple expenses from last week",
      amount: 67.8,
      yourShare: 0,
      paidBy: { name: "Sarah", avatar: "SC" },
      splitBetween: [
        { name: "You", avatar: "YO", amount: 0 },
        { name: "Sarah", avatar: "SC", amount: 0 },
      ],
      group: { name: "Apartment Rent", icon: "🏠" },
      category: "general",
      date: "Yesterday",
      timestamp: "3:20 PM",
      status: "settled",
    },
    {
      id: "5",
      type: "expense",
      title: "Grocery Shopping",
      description: "Weekly groceries for the house",
      amount: 156.75,
      yourShare: -52.25,
      paidBy: { name: "You", avatar: "YO" },
      splitBetween: [
        { name: "You", avatar: "YO", amount: -52.25 },
        { name: "Alex", avatar: "AJ", amount: 52.25 },
        { name: "Sarah", avatar: "SC", amount: 52.25 },
      ],
      group: { name: "Apartment Rent", icon: "🏠" },
      category: "shopping",
      date: "2 days ago",
      timestamp: "4:15 PM",
      status: "pending",
    },
    {
      id: "6",
      type: "expense",
      title: "Hotel Booking",
      description: "Lake Tahoe weekend accommodation",
      amount: 320.0,
      yourShare: 80.0,
      paidBy: { name: "Lisa", avatar: "LB" },
      splitBetween: [
        { name: "You", avatar: "YO", amount: 80.0 },
        { name: "Lisa", avatar: "LB", amount: 80.0 },
        { name: "Tom", avatar: "TC", amount: 80.0 },
        { name: "Emma", avatar: "EW", amount: 80.0 },
      ],
      group: { name: "Weekend Trip", icon: "✈️" },
      category: "travel",
      date: "3 days ago",
      timestamp: "10:30 AM",
      status: "pending",
    },
  ]);

  const filtered = activities.filter((a) => {
    if (activeFilter === "you_owe") return a.yourShare > 0;
    if (activeFilter === "you_are_owed") return a.yourShare < 0;
    return true;
  });
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View >
            <Text style={styles.headerTitle}>Activity</Text>
            <Text style={styles.subText}>{filtered.length} transactions</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Feather name="filter" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        {["all", "you_owe", "you_are_owed"].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setActiveFilter(type)}
            style={[
              styles.tabButton,
              activeFilter === type && styles.tabActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeFilter === type && styles.tabTextActive,
              ]}
            >
              {type === "all"
                ? "All"
                : type === "you_owe"
                ? "You Owe"
                : "You are Owed"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {filtered.map((item, i) => {
          const isExpanded = expandedCardId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => toggleExpand(item.id)}
            >
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text
                  style={{
                    color:
                      item.yourShare > 0
                        ? "red"
                        : item.yourShare < 0
                        ? "green"
                        : "gray",
                  }}
                >
                  {item.yourShare > 0
                    ? `You owe $${item.yourShare}`
                    : item.yourShare < 0
                    ? `You get $${Math.abs(item.yourShare)}`
                    : "Settled"}
                </Text>
              </View>
              <Text style={styles.subText}>{item.description}</Text>
              {isExpanded && (
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.subText}>
                    Paid by: {item.paidBy.name}
                  </Text>
                  <Text style={styles.subText}>
                    Group: {item.group.icon} {item.group.name}
                  </Text>
                  <Text style={styles.subText}>
                    Category: {item.category} • {item.date}, {item.timestamp}
                  </Text>
                  <Text style={styles.subText}>
                    Split between: {item.splitBetween.length} people
                  </Text>
                  {item.splitBetween.map((person) => (
                    <Text key={person.name} style={styles.subText}>
                      - {person.name}: ${Math.abs(person.amount)}
                    </Text>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        {filtered.length === 0 && (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Feather name="file" size={48} color="gray" />
            <Text style={styles.headerTitle}>No activities found</Text>
            <Text style={styles.subText}>
              Nothing to show in this category.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.foreground,
  },
  subText: {
    fontSize: 13,
    color: "gray",
  },
  tabsContainer: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: colors.secondary,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: colors.card,
  },
  tabText: {
    color: "gray",
    fontSize: 13,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.foreground,
  },
});

export default ActivityScreen;
