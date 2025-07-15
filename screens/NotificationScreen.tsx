import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
// import { Check, Clock, DollarSign, Users } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Routes from "@/constants/ApiRoutes";
import { fetchAPI } from "@/utils/fetchAPI";
import { lightThemeColors as colors } from "../constants/Colors";

interface Notification {
  id: string;
  type: "group_invitation" | "expense_added" | "payment_received" | "reminder";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  status?: "pending" | "accepted" | "declined" | "loading";
  groupInfo?: {
    groupName: string;
    inviterName: string;
    inviterAvatar: string;
    memberCount: number;
  };
  expenseInfo?: {
    amount: number;
    expenseName: string;
    paidBy: string;
  };
}

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>([
    // {
    //   id: "1",
    //   type: "group_invitation",
    //   title: "Group Invitation",
    //   message: "Rajan jha has invited you to join Trip to kathmandu Group",
    //   timestamp: "2 minutes ago",
    //   isRead: false,
    //   groupInfo: {
    //     groupName: "Trip to kathmandu",
    //     inviterName: "Rajan jha",
    //     inviterAvatar: "RJ",
    //     memberCount: 5,
    //   },
    // },
    // {
    //   id: "2",
    //   type: "group_invitation",
    //   title: "Group Invitation",
    //   message: "Sarah Chen has invited you to join Office Lunch Group",
    //   timestamp: "1 hour ago",
    //   isRead: false,
    //   groupInfo: {
    //     groupName: "Office Lunch",
    //     inviterName: "Sarah Chen",
    //     inviterAvatar: "SC",
    //     memberCount: 8,
    //   },
    // },
    // {
    //   id: "3",
    //   type: "expense_added",
    //   title: "New Expense Added",
    //   message:
    //     "Mike added 'Dinner at Italian Restaurant' to Weekend Trip group",
    //   timestamp: "3 hours ago",
    //   isRead: true,
    //   expenseInfo: {
    //     amount: 67.5,
    //     expenseName: "Dinner at Italian Restaurant",
    //     paidBy: "Mike Rodriguez",
    //   },
    // },
    // {
    //   id: "4",
    //   type: "payment_received",
    //   title: "Payment Received",
    //   message: "Emma Wilson paid you $25.00 for Movie tickets",
    //   timestamp: "1 day ago",
    //   isRead: true,
    //   expenseInfo: {
    //     amount: 25.0,
    //     expenseName: "Movie tickets",
    //     paidBy: "Emma Wilson",
    //   },
    // },
    // {
    //   id: "5",
    //   type: "group_invitation",
    //   title: "Group Invitation",
    //   message: "Alex Johnson has invited you to join Roommate Expenses Group",
    //   timestamp: "2 days ago",
    //   isRead: false,
    //   groupInfo: {
    //     groupName: "Roommate Expenses",
    //     inviterName: "Alex Johnson",
    //     inviterAvatar: "AJ",
    //     memberCount: 3,
    //   },
    // },
    // {
    //   id: "6",
    //   type: "reminder",
    //   title: "Payment Reminder",
    //   message: "Don't forget to settle up with John for last week's expenses",
    //   timestamp: "3 days ago",
    //   isRead: true,
    // },
  ]);

  const handleAcceptInvitation = async (notificationId: string) => {
    try {
      // Update the notification state to show loading
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, status: "loading" } : n
        )
      );

      // Call the accept API
      const response = await fetchAPI(
        Routes.ACCEPT_INVITATION(notificationId),
        "POST"
      );

      if (response.success) {
        // Refresh the notifications list
        await getAllInvites();
      } else {
        // Revert if API call fails
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, status: "pending" } : n
          )
        );
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, status: "pending" } : n
        )
      );
    }
  };
  const handleDeclineInvitation = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
    console.log("Declined invitation:", notificationId);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "group_invitation":
        return <Feather name="user" size={20} color={colors.primary} />;
      case "expense_added":
        return <Feather name="dollar-sign" size={20} color="#10B981" />;
      case "payment_received":
        return <Feather name="check" size={20} color="#10B981" />;
      case "reminder":
        return <Feather name="clock" size={20} color="#F97316" />;
      default:
        return <Feather name="user" size={20} color="#6B7280" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case "group_invitation":
        return colors.accent;
      case "expense_added":
        return "#D1FAE5";
      case "payment_received":
        return "#D1FAE5";
      case "reminder":
        return "#FFEDD5";
      default:
        return colors.muted;
    }
  };

  const getAllInvites = useCallback(async () => {
    try {
      const data = await fetchAPI(Routes.GET_NOTIFICATIONS, "GET");
      console.log("This is noti", JSON.stringify(data));
      if (data.success && data.data) {
        const apiNotifications = data.data.map((invite: any) => ({
          id: invite.groupId?._id,
          type: "group_invitation" as const,
          title: "Group Invitation",
          message: `${invite.invitedBy.username} has invited you to join ${invite.groupId.name} group`,
          timestamp: new Date(invite.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          isRead: false,
          status: invite.status || "pending", // Include status from API
          groupInfo: {
            groupName: invite.groupId.name,
            inviterName: invite.invitedBy.username,
            inviterAvatar:
              invite.invitedBy.username.charAt(0) +
              invite.invitedBy.username.charAt(1),
            memberCount: 0,
          },
        }));
        setNotifications(apiNotifications);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getAllInvites();
  }, []);

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => markAsRead(item.id)}
      activeOpacity={0.6}
      style={[
        styles.notificationCard,
        {
          backgroundColor: colors.card,
          borderColor: !item.isRead ? colors.primary : colors.border,
          borderWidth: 1,
          marginBottom: 12,
        },
      ]}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <View
            style={[
              styles.notificationIconContainer,
              { backgroundColor: getNotificationBgColor(item.type) },
            ]}
          >
            {getNotificationIcon(item.type)}
          </View>
          <View style={styles.notificationTextContainer}>
            <View style={styles.notificationTitleContainer}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              {!item.isRead && (
                <View
                  style={[
                    styles.unreadIndicator,
                    { backgroundColor: colors.primary },
                  ]}
                />
              )}
            </View>
            <Text style={styles.notificationMessage}>{item.message}</Text>

            {/* Group Info for Group Invitations */}
            {/* {item.type === "group_invitation" && item.groupInfo && (
              <View style={styles.groupInfoContainer}>
                <View style={styles.groupInfoHeader}>
                  <View
                    style={[styles.avatar, { backgroundColor: colors.primary }]}
                  >
                    <Text style={styles.avatarText}>
                      {item.groupInfo.inviterAvatar}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.groupName}>
                      {item.groupInfo.groupName}
                    </Text>
                    <Text style={styles.memberCount}>
                      {item.groupInfo.memberCount} members
                    </Text>
                  </View>
                </View>
              </View>
            )} */}

            {/* Expense Info */}
            {/* {item.expenseInfo && (
              <View style={styles.expenseInfoContainer}>
                <View style={styles.expenseRow}>
                  <Text style={styles.expenseName}>
                    {item.expenseInfo.expenseName}
                  </Text>
                  <Text style={styles.expenseAmount}>
                    ${item.expenseInfo.amount.toFixed(2)}
                  </Text>
                </View>
                {item.expenseInfo.paidBy && (
                  <Text style={styles.paidBy}>
                    Paid by {item.expenseInfo.paidBy}
                  </Text>
                )}
              </View>
            )} */}

            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </View>

        {/* Action Buttons for Group Invitations */}
        {item.type === "group_invitation" && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              onPress={() => handleAcceptInvitation(item.id)}
              disabled={item.status === "accepted" || item.status === "loading"}
              style={[
                styles.actionButton,
                styles.acceptButton,
                (item.status === "accepted" || item.status === "loading") &&
                  styles.disabledButton,
              ]}
              activeOpacity={0.6}
            >
              {item.status === "loading" ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Feather name="check" size={16} color="white" />
                  <Text style={styles.actionButtonText}>
                    {item.status === "accepted" ? "Accepted" : "Accept"}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {!item.status === "accepted" && (
              <TouchableOpacity
                onPress={() => handleDeclineInvitation(item.id)}
                disabled={
                  item.status === "declined" || item.status === "accepted"
                }
                style={[
                  styles.actionButton,
                  styles.declineButton,
                  (item.status === "declined" || item.status === "accepted") &&
                    styles.disabledButton,
                ]}
              >
                <Feather name="x" size={16} color={colors.cardForeground} />
                <Text
                  style={[
                    styles.actionButtonText,
                    { color: colors.cardForeground },
                  ]}
                >
                  {item.status === "declined" ? "Declined" : "Decline"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "left", "right"]}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color="gray" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
            {/* {unreadCount > 0 && ( */}
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
            {/* )} */}
          </View>
        </View>

        {/* Notifications List */}
        <View style={styles.notificationsContainer}>
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Feather name="users" size={16} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>No notifications</Text>
              <Text style={styles.emptyMessage}>
                You're all caught up! New notifications will appear here.
              </Text>
            </View>
          ) : (
            <FlatList
              data={notifications}
              renderItem={renderNotificationItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.notificationsList}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "hsl(222.2, 84%, 4.9%)",
  },
  unreadBadge: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  notificationsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  notificationsList: {
    paddingBottom: 24,
  },
  notificationCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  notificationTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "hsl(222.2, 84%, 4.9%)",
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: "hsl(215.4, 16.3%, 46.9%)",
    marginBottom: 12,
  },
  groupInfoContainer: {
    backgroundColor: "hsl(210, 40%, 96.1%)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  groupInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  avatarText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  groupName: {
    fontSize: 14,
    fontWeight: "500",
    color: "hsl(222.2, 84%, 4.9%)",
  },
  memberCount: {
    fontSize: 12,
    color: "hsl(215.4, 16.3%, 46.9%)",
  },
  expenseInfoContainer: {
    backgroundColor: "hsl(210, 40%, 96.1%)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  expenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  expenseName: {
    fontSize: 14,
    fontWeight: "500",
    color: "hsl(222.2, 84%, 4.9%)",
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "hsl(218, 100%, 22%)",
  },
  paidBy: {
    fontSize: 12,
    color: "hsl(215.4, 16.3%, 46.9%)",
  },
  timestamp: {
    fontSize: 12,
    color: "hsl(215.4, 16.3%, 46.9%)",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  acceptButton: {
    backgroundColor: "hsl(218, 100%, 22%)",
  },
  declineButton: {
    backgroundColor: "hsl(218, 27%, 96%)",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 96,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    backgroundColor: "hsl(210, 40%, 96.1%)",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "hsl(222.2, 84%, 4.9%)",
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "hsl(215.4, 16.3%, 46.9%)",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});

export default NotificationsScreen;
