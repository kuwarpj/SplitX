import Button from "@/components/ui/Button";
import { Feather } from "@expo/vector-icons";
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

const GroupsScreen = () => {
  const [groups] = useState([
    {
      id: "1",
      name: "Apartment Rent",
      type: "home",
      icon: "🏠",
      totalBalance: 450.0,
      members: [
        { id: "1", name: "Alex", avatar: "AJ" },
        { id: "2", name: "Sarah", avatar: "SC" },
        { id: "3", name: "Mike", avatar: "MR" },
      ],
      recentActivity: "Rent for December added",
      pendingSettlements: 2,
      lastUpdated: "2 hours ago",
      description: "Monthly rent and utilities",
    },
    {
      id: "2",
      name: "Weekend Trip",
      type: "travel",
      icon: "✈️",
      totalBalance: -89.25,
      members: [
        { id: "4", name: "Emma", avatar: "EW" },
        { id: "5", name: "John", avatar: "JD" },
        { id: "6", name: "Lisa", avatar: "LB" },
        { id: "7", name: "Tom", avatar: "TC" },
      ],
      recentActivity: "Hotel payment split",
      pendingSettlements: 1,
      lastUpdated: "1 day ago",
      description: "Lake Tahoe weekend getaway",
    },
    {
      id: "3",
      name: "Dinner Club",
      type: "food",
      icon: "🍽️",
      totalBalance: 34.5,
      members: [
        { id: "8", name: "Ryan", avatar: "RP" },
        { id: "9", name: "Kate", avatar: "KM" },
        { id: "10", name: "Dave", avatar: "DL" },
      ],
      recentActivity: "Italian restaurant bill",
      pendingSettlements: 0,
      lastUpdated: "3 days ago",
      description: "Weekly dinner outings",
    },
    {
      id: "4",
      name: "Office Lunch",
      type: "food",
      icon: "🍽️",
      totalBalance: 0,
      members: [
        { id: "11", name: "Amy", avatar: "AS" },
        { id: "12", name: "Bob", avatar: "BJ" },
        { id: "13", name: "Carol", avatar: "CD" },
        { id: "14", name: "Dan", avatar: "DF" },
      ],
      recentActivity: "All settled up!",
      pendingSettlements: 0,
      lastUpdated: "1 week ago",
      description: "Daily lunch orders",
    },
    {
      id: "5",
      name: "Gym Membership",
      type: "general",
      icon: "💪",
      totalBalance: -25.0,
      members: [
        { id: "15", name: "Steve", avatar: "SL" },
        { id: "16", name: "Nina", avatar: "NR" },
      ],
      recentActivity: "Monthly fee split",
      pendingSettlements: 1,
      lastUpdated: "5 days ago",
      description: "Shared fitness membership",
    },
  ]);

  const totalOwed = groups
    .filter((group) => group.totalBalance > 0)
    .reduce((sum, group) => sum + group.totalBalance, 0);
  const totalOwe = groups
    .filter((group) => group.totalBalance < 0)
    .reduce((sum, group) => sum + Math.abs(group.totalBalance), 0);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "left", "right"]}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.iconBtn}>
              <Feather name="arrow-left" size={20} color={colors.foreground} />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Groups</Text>
              <Text style={styles.subText}>{groups.length} active groups</Text>
            </View>
          </View>
          <Button label="New Group" icon="plus" onPress={() => {}} />
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather name="trending-up" size={16} color="green" />
              <Text style={styles.cardLabel}>Groups owe you</Text>
            </View>
            <Text style={[styles.amount, { color: "green" }]}>
              ${totalOwed.toFixed(2)}
            </Text>
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather name="trending-down" size={16} color="red" />
              <Text style={styles.cardLabel}>You owe groups</Text>
            </View>
            <Text style={[styles.amount, { color: "red" }]}>
              ${totalOwe.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Group List */}
        <Text style={styles.sectionTitle}>All Groups</Text>
        {groups.map((group) => (
          <View key={group.id} style={styles.groupCard}>
            <View style={styles.groupHeader}>
              <View style={styles.groupLeft}>
                <View style={styles.groupIcon}>
                  <Text>{group.icon}</Text>
                </View>
                <View>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={styles.subText}>{group.description}</Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color:
                      group.totalBalance > 0
                        ? "green"
                        : group.totalBalance < 0
                        ? "red"
                        : colors.mutedForeground,
                  }}
                >
                  {group.totalBalance === 0
                    ? "Settled"
                    : `${group.totalBalance > 0 ? "+" : "-"}$${Math.abs(
                        group.totalBalance
                      ).toFixed(2)}`}
                </Text>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Feather
                    name={
                      group.totalBalance === 0
                        ? "check-circle"
                        : group.pendingSettlements > 0
                        ? "clock"
                        : "dollar-sign"
                    }
                    size={14}
                    color={
                      group.totalBalance === 0
                        ? "green"
                        : group.pendingSettlements > 0
                        ? "orange"
                        : colors.primary
                    }
                  />
                  <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                    {group.totalBalance > 0
                      ? "owed"
                      : group.totalBalance < 0
                      ? "you owe"
                      : "settled"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Members */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
                gap: 6,
              }}
            >
              <Feather name="users" size={14} color={colors.mutedForeground} />
              <View style={{ flexDirection: "row" }}>
                {group.members.slice(0, 4).map((member) => (
                  <View
                    key={member.id}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: colors.accent,
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: -6,
                      borderWidth: 1,
                      borderColor: colors.card,
                    }}
                  >
                    <Text style={{ fontSize: 10, color: colors.primary }}>
                      {member.avatar.charAt(0)}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                {group.members.length} members
              </Text>
            </View>

            {/* Recent Activity */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Feather
                  name="calendar"
                  size={12}
                  color={colors.mutedForeground}
                />
                <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                  {group.recentActivity}
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                {group.lastUpdated}
              </Text>
            </View>

            {/* Settlements */}
            {group.pendingSettlements > 0 && (
              <View style={styles.settleBox}>
                <Feather name="clock" size={14} color="orange" />
                <Text style={{ fontSize: 13, color: "orange" }}>
                  {group.pendingSettlements} pending settlement
                  {group.pendingSettlements > 1 ? "s" : ""}
                </Text>
                <Button
                  variant="outline"
                  label="Settle"
                  onPress={() => {}}
                  style={{
                    height: 30,
                    paddingHorizontal: 10,
                    marginLeft: "auto",
                  }}
                  textStyle={{ fontSize: 12, color: "orange" }}
                />
              </View>
            )}
            {group.pendingSettlements === 0 && group.totalBalance === 0 && (
              <View style={styles.settleBoxGreen}>
                <Feather name="check-circle" size={14} color="green" />
                <Text style={{ fontSize: 13, color: "green" }}>
                  All settled up! 🎉
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* CTA */}
        <View style={styles.ctaBox}>
          <View style={styles.ctaIconBox}>
            <Feather name="plus" size={24} color={colors.primary} />
          </View>
          <Text style={styles.ctaTitle}>Start a New Group</Text>
          <Text style={styles.ctaSub}>
            Split expenses with roommates, friends, or travel companions
          </Text>
          <Button label="Create Group" icon="plus" onPress={() => {}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default GroupsScreen

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBtn: {
    backgroundColor: colors.secondary,
    padding: 8,
    borderRadius: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: colors.foreground },
  subText: { fontSize: 12, color: colors.mutedForeground },
  summaryRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  cardLabel: { fontSize: 12, color: colors.mutedForeground },
  amount: { fontSize: 20, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.foreground,
    marginBottom: 10,
  },
  groupCard: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  groupLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  groupName: { fontSize: 14, fontWeight: "600", color: colors.foreground },
  settleBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8ED",
    borderColor: "#FFEAD0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    gap: 8,
  },
  settleBoxGreen: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBFDF2",
    borderColor: "#D4F4DD",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    gap: 8,
  },
  ctaBox: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginTop: 24,
    borderColor: colors.border,
    borderWidth: 1,
  },
  ctaIconBox: {
    width: 48,
    height: 48,
    backgroundColor: colors.accent,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.foreground,
    marginBottom: 4,
  },
  ctaSub: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginBottom: 12,
    textAlign: "center",
  },
});
