import Routes from "@/constants/ApiRoutes";
import { fetchAPI } from "@/utils/fetchAPI";
import { formatTimeAgo } from "@/utils/utils";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { lightThemeColors as colors } from "../constants/Colors";

const GroupDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId } = route.params;

  const [expense, setExpense] = useState([]);
  const [userGroupSummary, setUserGroupSummary] = useState([]);

  const getGroupDetails = useCallback(async () => {
    try {
      const data = await fetchAPI(
        `${Routes.GET_GROUP_EXPENSE}${groupId}`,
        "GET"
      );

      if (data?.success === true) {
        setExpense(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getUserGroupFinincialSummary = useCallback(async () => {
    try {
      const data = await fetchAPI(
        Routes.GET_USER_GROUP_SUMMARY(groupId),
        "GET"
      );
      console.log("This is Central response------->", data);

      if (data?.success === true) {
        setUserGroupSummary(data?.data);
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    getGroupDetails();
    getUserGroupFinincialSummary();
  }, []);

  const groupData = {
    id: "1",
    name: "Weekend Trip",
    description: "Lake Tahoe adventure",
    icon: "✈️",
    members: [
      { id: "1", name: "You", avatar: "YO", balance: 0 },
      { id: "2", name: "Kuwar", avatar: "KS", balance: -89.25 },
      { id: "3", name: "Sarah", avatar: "SC", balance: 45.5 },
      { id: "4", name: "Mike", avatar: "MR", balance: 67.75 },
      { id: "5", name: "Emma", avatar: "EW", balance: -24.0 },
    ],
    transactions: [
      {
        id: "1",
        title: "Dinner at Italian Restaurant",
        description: "Team dinner on arrival",
        amount: 530,
        paidBy: { id: "2", name: "Kuwar", avatar: "KS" },
        splitBetween: [
          { id: "1", name: "You", avatar: "YO", balance: -132.5 },
          { id: "2", name: "Kuwar", avatar: "KS", balance: 397.5 },
          { id: "3", name: "Sarah", avatar: "SC", balance: -132.5 },
          { id: "4", name: "Mike", avatar: "MR", balance: -132.5 },
        ],
        category: "food",
        date: "Jul 10, 2025",
        time: "8:45 PM",
        userInvolvement: {
          isInvolved: true,
          amount: -132.5,
          status: "owe",
        },
      },
      {
        id: "2",
        title: "Hotel Booking",
        description: "2 nights at Lake Resort",
        amount: 800,
        paidBy: { id: "1", name: "You", avatar: "YO" },
        splitBetween: [],
        category: "travel",
        date: "Jul 9, 2025",
        time: "3:20 PM",
        userInvolvement: {
          isInvolved: true,
          amount: 600,
          status: "lent",
        },
      },
      // ...more transactions
    ],
  };

  const yourNetBalance =
    groupData.members.find((m) => m.id === "1")?.balance || 0;

  const membersYouOwe = groupData.members.filter(
    (m) => m.balance < 0 && m.id !== "1"
  );
  const membersWhoOweYou = groupData.members.filter(
    (m) => m.balance > 0 && m.id !== "1"
  );

  const getStatusColor = (value: number) =>
    value === 0 ? "#6b7280" : value > 0 ? "#16a34a" : "#dc2626";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="gray" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.emoji}>{groupData.icon}</Text>
          <View>
            <Text style={styles.groupTitle}>{userGroupSummary?.name}</Text>
            <Text style={styles.groupDesc}>
              {userGroupSummary?.description}
            </Text>
          </View>
        </View>
        <Feather name="settings" size={20} color="gray" />
      </View>

      {/* Members */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Members</Text>
            <View style={styles.row}>
              <Feather name="users" size={16} color="gray" />
              <Text style={styles.grayText}>
                {userGroupSummary?.totalMembers}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            {userGroupSummary?.members?.map((m: any) => (
              <View key={m.id} style={styles.avatar}>
                <Image
                  source={{ uri: m?.avatarUrl }}
                  style={{ width: 30, height: 30, borderRadius: 8 }}
                />
              </View>
            ))}
          </View>
        </View>
        {/* Balances */}
        <View style={{ marginTop: 20 }}>
          {/* Title */}
          <Text style={{ fontWeight: "600", fontSize: 16, color: "#111827" }}>
            Balance Overview
          </Text>

          {/* Balance Card */}
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 16,
              marginTop: 12,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 3,
              marginBottom:16
            }}
          >
            {/* Net Balance */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                
              }}
            >
              <View>
                <Text style={{ fontSize: 13, color: "#6B7280" }}>
                  Your net balance
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color:
                      yourNetBalance > 0
                        ? "#16a34a"
                        : yourNetBalance < 0
                        ? "#dc2626"
                        : "#374151",
                  }}
                >
                  {yourNetBalance === 0
                    ? "All settled! 🎉"
                    : `₹${Math.abs(yourNetBalance).toFixed(0)}`}
                </Text>
              </View>

              {yourNetBalance !== 0 && (
                <View
                  style={{
                    backgroundColor: yourNetBalance > 0 ? "#bbf7d0" : "#fecaca",
                    paddingVertical: 4,
                    paddingHorizontal: 12,
                    borderRadius: 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: yourNetBalance > 0 ? "#15803d" : "#b91c1c",
                    }}
                  >
                    {yourNetBalance > 0 ? "You are owed" : "You owe"}
                  </Text>
                </View>
              )}
            </View>

            {/* Divider */}
            {(membersYouOwe.length > 0 || membersWhoOweYou.length > 0) && (
              <View
                style={{
                  height: 1,
                  backgroundColor: "#E5E7EB",
                  marginVertical: 12,
                }}
              />
            )}

            {userGroupSummary?.balances?.map((member: any) => (
              <View
                key={member._id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                {/* Left Side - Avatar and Name */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: "#bbf7d0",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "#15803d",
                      }}
                    >
                      {member.username.charAt(0)}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: "#374151" }}>
                    {member?.status === "owe"
                      ? `You owe ${member?.username}`
                      : `${member?.username} owe You`}
                  </Text>
                </View>

                {/* Right Side - Net Balance and Status */}
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: member.status === "lent" ? "#16a34a" : "#dc2626",
                    }}
                  >
                    ₹{Math.abs(member.netBalance).toFixed(0)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.rowBetween}>
          <TouchableOpacity style={styles.primaryBtn}>
            <Feather name="plus" size={16} color="#fff" />
            <Text style={styles.btnText}>Add Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineBtn}>
            <Feather name="dollar-sign" size={16} color="#1d4ed8" />
            <Text style={{ color: "#1d4ed8", marginLeft: 4 }}>Settle Up</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          {expense?.map((t: any) => (
            <View key={t._id} style={styles.transactionCard}>
              <View style={styles.rowBetween}>
                <View style={styles.row}>
                  <Text style={{ fontSize: 20 }}>
                    {/* {getCategoryIcon(t.category)} */}
                    🍽️
                  </Text>
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ fontWeight: "bold" }}>{t.description}</Text>
                    <Text style={styles.grayText}>
                      {formatTimeAgo(t.createdAt)}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        color:
                          t.status === "lent"
                            ? "#16a34a"
                            : t.status === "owe"
                            ? "#dc2626"
                            : "#6b7280",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      ₹{t.amountInView}
                    </Text>

                    <Text
                      style={{
                        color:
                          t.status === "lent"
                            ? "#16a34a"
                            : t.status === "owe"
                            ? "#dc2626"
                            : "#6b7280",
                        fontSize: 12,
                      }}
                    >
                      {t.status === "lent"
                        ? "lent"
                        : t.status === "owe"
                        ? "owe"
                        : ""}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: 12,
                  padding: 12,
                  marginVertical: 12,
                }}
              >
                <Text style={{ fontSize: 12, color: "#374151" }}>
                  <Text style={{ fontWeight: 500 }}>{t?.paidBy?.username}</Text>{" "}
                  paid <Text style={{ fontWeight: 600 }}>₹{t?.amount}</Text> and
                  split between{" "}
                  <Text style={{ fontWeight: 500 }}>
                    {t?.participants?.length} members
                  </Text>
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GroupDetailsScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    padding: 16,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  emoji: {
    fontSize: 24,
    marginRight: 8,
  },
  groupTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#111827",
  },
  groupDesc: {
    fontSize: 12,
    color: "#6b7280",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#111827",
  },
  grayText: {
    fontSize: 12,
    color: "#6b7280",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  netCard: {
    marginTop: 20,
    backgroundColor: "#f0f9ff",
    padding: 20,
    borderRadius: 16,
  },
  center: {
    alignItems: "center",
  },
  balanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  primaryBtn: {
    flexDirection: "row",
    backgroundColor: "#1d4ed8",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 6,
    justifyContent: "center",
  },
  outlineBtn: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#1d4ed8",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginLeft: 6,
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
  },
  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 2,
  },
});
