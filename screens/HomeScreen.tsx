import Button from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { lightThemeColors as colors } from "../constants/Colors";

export default function HomeScreen({ navigation }: any) {
  const { user, userGroup } = useApp();
  const [friendBalances] = useState([
    {
      id: "1",
      name: "Alex Johnson",
      balance: 125.5,
      lastActivity: "2 days ago",
    },
    {
      id: "2",
      name: "Sarah Chen",
      balance: -45.25,
      lastActivity: "1 week ago",
    },
    {
      id: "3",
      name: "Mike Rodriguez",
      balance: 89.75,
      lastActivity: "3 days ago",
    },
    {
      id: "4",
      name: "Emma Wilson",
      balance: -44.0,
      lastActivity: "5 days ago",
    },
  ]);

  const totalSummary = userGroup?.reduce(
    (acc, group) => {
      acc.totalOwe += group.summary?.youOwe || 0;
      acc.totalLent += group.summary?.youLent || 0;
      return acc;
    },
    { totalOwe: 0, totalLent: 0 }
  );

  const totalOwe = totalSummary?.totalOwe;
  const totalLent = totalSummary?.totalLent;
  const netBalance = totalLent - totalOwe;
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "left", "right"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Feather name="dollar-sign" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.title}>SplitX</Text>
            <Text style={styles.subtitle}>Welcome back, {user?.username}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Notification");
            }}
            style={styles.iconButton}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={colors.foreground}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="settings-outline"
              size={20}
              color={colors.foreground}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.container}>
        {/* Net Balance Card */}
        <View style={styles.card}>
          <Text style={styles.centerText}>Your net balance</Text>
          <Text
            style={[
              styles.netBalance,
              { color: netBalance >= 0 ? "green" : "red" },
            ]}
          >
            ₹{Math.abs(netBalance)?.toFixed(2)}
          </Text>
          <Text style={styles.centerSubText}>
            {netBalance >= 0 ? "You are owed overall" : "You owe overall"}
          </Text>

          <View style={styles.balanceRow}>
            <View style={styles.balanceBox}>
              <Text style={styles.label}>You're owed</Text>
              <Text style={styles.amountGreen}>₹{totalLent?.toFixed(2)}</Text>
            </View>
            <View style={styles.balanceBox}>
              <Text style={styles.label}>You owe</Text>
              <Text style={styles.amountRed}>₹{totalOwe?.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Button
            label="Add Expense"
            icon="plus"
            variant="solid"
            onPress={() => {
              navigation.navigate("AddExpense");
            }}
          />

          <Button
            label="Settle Up"
            icon={<FontAwesome5 name="handshake" size={16} color="#007AFF" />}
            variant="outline"
            onPress={() => {}}
          />
        </View>

        {/* Friends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Friends</Text>
          {friendBalances.map((friend) => (
            <View key={friend.id} style={styles.friendCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {friend.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Text>
              </View>
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{friend.name}</Text>
                <Text style={styles.friendActivity}>{friend.lastActivity}</Text>
              </View>
              <View style={styles.balanceInfo}>
                <Text
                  style={{
                    color:
                      friend.balance > 0
                        ? "green"
                        : friend.balance < 0
                        ? "red"
                        : "#888",
                    fontWeight: "600",
                  }}
                >
                  {friend.balance > 0 ? "+" : ""}$
                  {Math.abs(friend.balance).toFixed(2)}
                </Text>
                <Text style={styles.friendActivity}>
                  {friend.balance > 0
                    ? "owes you"
                    : friend.balance < 0
                    ? "you owe"
                    : "settled up"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Feather
              name="file-text"
              size={20}
              color={colors.primary}
              style={styles.activityIcon}
            />
            <View style={styles.activityText}>
              <Text style={styles.friendName}>
                Dinner at Italian Restaurant
              </Text>
              <Text style={styles.friendActivity}>
                Split with Alex, Sarah, Mike • $67.50 total
              </Text>
              <Text style={styles.friendActivity}>2 hours ago</Text>
            </View>
            <Text style={{ color: "red", fontWeight: "600" }}>- $16.88</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    backgroundColor: colors.background,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 16,

    padding: 16,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  iconBox: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  iconButton: {
    padding: 8,
    backgroundColor: colors.card,
    borderRadius: 10,
    elevation: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: colors.foreground,
  },
  subtitle: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  centerText: {
    textAlign: "center",
    fontSize: 14,
    color: colors.mutedForeground,
  },
  netBalance: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
  },
  centerSubText: {
    textAlign: "center",
    fontSize: 12,
    color: colors.mutedForeground,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },
  balanceBox: {
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: colors.foreground,
  },
  amountGreen: {
    fontSize: 20,
    color: "green",
  },
  amountRed: {
    fontSize: 20,
    color: "red",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: colors.foreground,
  },
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  friendName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.foreground,
  },
  friendActivity: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  balanceInfo: {
    alignItems: "flex-end",
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  activityIcon: {
    marginRight: 10,
  },
  activityText: {
    flex: 1,
  },
});
