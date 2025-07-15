import Button from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";
import { formatTimeAgo } from "@/utils/utils";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
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

const GroupsScreen = () => {
  const navigation = useNavigation();
  const { userGroup } = useApp();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "left", "right"]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View>
            <Text style={styles.headerTitle}>Groups</Text>
            <Text style={styles.subText}>
              {userGroup?.length} active groups
            </Text>
          </View>
        </View>
        <Button
          label="New Group"
          icon="plus"
          onPress={() => {
            navigation.navigate("CreateGroup", {});
          }}
        />
      </View>

      {/* Summary Cards */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.summaryRow}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather name="trending-up" size={16} color="green" />
              <Text style={styles.cardLabel}>Groups owe you</Text>
            </View>
            <Text style={[styles.amount, { color: "green" }]}>
              {/* ${totalOwed.toFixed(2)} */}775
            </Text>
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather name="trending-down" size={16} color="red" />
              <Text style={styles.cardLabel}>You owe groups</Text>
            </View>
            <Text style={[styles.amount, { color: "red" }]}>
              {/* ${totalOwe.toFixed(2)} */} 6686
            </Text>
          </View>
        </View>

        {/* Group List */}
        <Text style={styles.sectionTitle}>All Groups</Text>
        {userGroup?.map((group: any, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              navigation.navigate("GroupDetails", { groupId: group._id })
            }
            activeOpacity={0.8}
          >
            <View key={group._id} style={styles.groupCard}>
              <View style={styles.groupHeader}>
                <View style={styles.groupLeft}>
                  <View style={styles.groupIcon}>
                    {/* <Text>{group.icon}</Text> */}
                    <Image
                      source={{ uri: group.iconUrl }}
                      style={{ width: 30, height: 30, borderRadius: 8 }}
                    />
                  </View>
                  <View>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.subText}>{group.description}</Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  {/* You Lent */}
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "green",
                      marginTop: 2,
                      fontSize: 10,
                    }}
                  >
                    Lent: ${group.youLent.toFixed(2)}
                  </Text>

                  {/* You Owe */}
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "red",
                      marginTop: 2,
                      fontSize: 10,
                    }}
                  >
                    Owe: ${group.youOwe.toFixed(2)}
                  </Text>
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
                <Feather
                  name="users"
                  size={14}
                  color={colors.mutedForeground}
                />
                <View style={{ flexDirection: "row" }}>
                  {group.members.slice(0, 4).map((member: any) => (
                    <View
                      key={member._id}
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
                        {member.username.charAt(0)}
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
                    {group.latestTransaction?.description} added
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                  {formatTimeAgo(group.latestTransaction?.createdAt)}
                </Text>
              </View>

              {/* Settlements */}
              {/* {group.pendingSettlements > 0 && (
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
              )} */}
            </View>
          </TouchableOpacity>
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

export default GroupsScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 16,

    padding: 16,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
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
