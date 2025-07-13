import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
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

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      food: "🍽️",
      travel: "🏕️",
      transport: "🚗",
      home: "🏠",
      entertainment: "🎬",
    };
    return icons[category] || "💰";
  };

  const getTransactionStatus = (status: string, amount: number) => {
    if (status === "not_involved") return "Not involved";
    if (status === "settled") return "Settled";
    return `${status === "lent" ? "Lent" : "Owe"} ₹${Math.abs(amount)}`;
  };

  return (
    <SafeAreaView style={{ flex: 1,  backgroundColor: colors.background, }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="gray" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.emoji}>{groupData.icon}</Text>
          <View>
            <Text style={styles.groupTitle}>{groupData.name}</Text>
            <Text style={styles.groupDesc}>{groupData.description}</Text>
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
              <Text style={styles.grayText}>{groupData.members.length}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            {groupData.members.map((m) => (
              <View key={m.id} style={styles.avatar}>
                <Text style={{ color: "#1d4ed8", fontWeight: "bold" }}>
                  {m.avatar[0]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Net Balance */}
        <View style={styles.netCard}>
          <View style={styles.center}>
            <View style={styles.balanceIcon}>
              <Feather name="dollar-sign" size={24} color="#1d4ed8" />
            </View>
            <Text style={styles.grayText}>Your net balance</Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: getStatusColor(yourNetBalance),
              }}
            >
              {yourNetBalance === 0
                ? "All settled 🎉"
                : `₹${Math.abs(yourNetBalance)}`}
            </Text>
            <Text
              style={{
                color: getStatusColor(yourNetBalance),
                marginTop: 4,
              }}
            >
              {yourNetBalance > 0 ? "You are owed" : "You owe"}
            </Text>
          </View>
        </View>

        {/* Balances */}
        {membersYouOwe.concat(membersWhoOweYou).map((m) => (
          <View key={m.id} style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={styles.row}>
                <View
                  style={[
                    styles.circle,
                    {
                      backgroundColor: m.balance > 0 ? "#dcfce7" : "#fee2e2",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: m.balance > 0 ? "#15803d" : "#dc2626",
                      fontWeight: "bold",
                    }}
                  >
                    {m.avatar[0]}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontWeight: "bold" }}>{m.name}</Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: m.balance > 0 ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {m.balance > 0 ? "owes you" : "you owe"}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontWeight: "bold",
                  color: m.balance > 0 ? "#16a34a" : "#dc2626",
                }}
              >
                ₹{Math.abs(m.balance).toFixed(0)}
              </Text>
            </View>
          </View>
        ))}

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
          {groupData.transactions.map((t) => (
            <View key={t.id} style={styles.transactionCard}>
              <View style={styles.rowBetween}>
                <View style={styles.row}>
                  <Text style={{ fontSize: 20 }}>
                    {getCategoryIcon(t.category)}
                  </Text>
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ fontWeight: "bold" }}>{t.title}</Text>
                    <Text style={styles.grayText}>{t.date}</Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      color:
                        t.userInvolvement.status === "lent"
                          ? "#16a34a"
                          : t.userInvolvement.status === "owe"
                          ? "#dc2626"
                          : "#6b7280",
                      fontWeight: "bold",
                    }}
                  >
                    {getTransactionStatus(
                      t.userInvolvement.status,
                      t.userInvolvement.amount
                    )}
                  </Text>
                </View>
              </View>
              <View style={{backgroundColor:'#F9FAFB', borderRadius: 12, padding:12, marginVertical:12}}>
                <Text style={{fontSize:12, color: '#374151'}}>
                  <Text style={{fontWeight:500}}>Kuwar Jha </Text>{" "}
                  paid{" "}
                  <Text style={{fontWeight:600}}>
                    ₹500}
                  </Text>{" "}
                  and split between{" "}
                  <Text style={{fontWeight:500}}>
                    4 members
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
