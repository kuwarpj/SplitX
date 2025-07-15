import Loader from "@/components/Loader";
import Routes from "@/constants/ApiRoutes";
import { useApp } from "@/context/AppContext";
import { fetchAPI } from "@/utils/fetchAPI";
import { storage } from "@/utils/storage";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { lightThemeColors as colors } from "../constants/Colors";

export default function AccountScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const { setIsLoggedIn, user } = useApp();
  const [loading, setLoading] = useState(false);
  const userProfile = {
    name: "John Doe",
    username: "john.doe",
    email: "john.doe@example.com",
    avatar: "JD",
    totalExpenses: 1247,
    totalSaved: 2456,
  };

  const settingsItems = [
    {
      title: "Dark Mode",
      description: "Switch to dark theme",
      icon: darkMode ? (
        <Feather name="sun" size={20} color="#4B5563" />
      ) : (
        <Feather name="moon" size={20} color="#4B5563" />
      ),
      value: darkMode,
      toggle: () => setDarkMode((v) => !v),
    },
    {
      title: "Push Notifications",
      description: "Get notified about new expenses",
      icon: <MaterialIcons name="notifications" size={20} color="#4B5563" />,
      value: notifications,
      toggle: () => setNotifications((v) => !v),
    },
    {
      title: "Email Notifications",
      description: "Receive email updates",
      icon: <MaterialIcons name="email" size={20} color="#4B5563" />,
      value: emailNotifications,
      toggle: () => setEmailNotifications((v) => !v),
    },
  ];

  const supportItems = [
    {
      title: "Help Center",
      description: "Get help and support",
      icon: <MaterialIcons name="help-outline" size={20} color="#4B5563" />,
    },
    {
      title: "Privacy Policy",
      description: "Read our privacy policy",
      icon: <Feather name="file-text" size={20} color="#4B5563" />,
    },
    {
      title: "Terms of Service",
      description: "View terms and conditions",
      icon: <Feather name="file-text" size={20} color="#4B5563" />,
    },
  ];

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAPI(Routes.LOGOUT, "POST");
      if (data?.success === true) {
        setIsLoggedIn(false);
        await storage.remove("token");
        await storage.remove("user");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "left", "right"]}
    >
      {loading && <Loader />}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View>
            <Text style={styles.headerTitle}>Account</Text>
            <Text style={styles.headerSub}>Profile & Settings</Text>
          </View>
        </View>
        <Feather name="settings" size={24} color="#4B5563" />
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.profileTop}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{userProfile.avatar}</Text>
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <Feather name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.username}</Text>
              <Text style={styles.profileHandle}>{user?.email}</Text>
            </View>

            <Feather name="edit-2" size={20} color="#6B7280" />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statsBlock}>
              <Text style={styles.statsValue}>{userProfile.totalExpenses}</Text>
              <Text style={styles.statsLabel}>Expenses</Text>
            </View>
            <View style={styles.statsBlock}>
              <Text style={[styles.statsValue, { color: "#16a34a" }]}>
                ${userProfile.totalSaved}
              </Text>
              <Text style={styles.statsLabel}>Saved</Text>
            </View>
            <View style={styles.statsBlock}>
              <Text style={styles.statsValue}>2.5y</Text>
              <Text style={styles.statsLabel}>Member</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.card}>
          {settingsItems.map((item, i) => (
            <View
              key={item.title}
              style={[
                styles.row,
                i < settingsItems.length - 1 && styles.rowBorder,
              ]}
            >
              <View style={styles.rowLeft}>
                <View style={styles.iconWrap}>{item.icon}</View>
                <View>
                  <Text style={styles.rowTitle}>{item.title}</Text>
                  <Text style={styles.rowDesc}>{item.description}</Text>
                </View>
              </View>
              <Switch
                trackColor={{ false: "#D1D5DB", true: "#2563EB" }}
                thumbColor="#fff"
                onValueChange={item.toggle}
                value={item.value}
              />
            </View>
          ))}
        </View>

        {/* Support */}
        <Text style={styles.sectionTitle}>Support & Legal</Text>
        <View style={styles.card}>
          {supportItems.map((item, i) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.row,
                i < supportItems.length - 1 && styles.rowBorder,
              ]}
            >
              <View style={styles.rowLeft}>
                <View style={styles.iconWrap}>{item.icon}</View>
                <View>
                  <Text style={styles.rowTitle}>{item.title}</Text>
                  <Text style={styles.rowDesc}>{item.description}</Text>
                </View>
              </View>

              <Feather name="chevron-right" size={20} color={colors.primary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={handleLogout}
            style={styles.signOutBtn}
          >
            <Feather name="log-out" size={16} color="#DC2626" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.footerVersion}>ShareBills v2.1.0</Text>
          <Text style={styles.footerNote}>
            Made with ❤️ for splitting expenses
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 16,
  },
  header: {
    padding: 16,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  headerSub: { fontSize: 12, color: "#6B7280" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  profileTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarWrap: { position: "relative" },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "white", fontSize: 24, fontWeight: "bold" },
  cameraButton: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#2563EB",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  profileHandle: { fontSize: 12, color: "#6B7280" },
  profileEmail: { fontSize: 12, color: "#6B7280" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 16,
    paddingTop: 12,
  },
  statsBlock: { alignItems: "center" },
  statsValue: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  statsLabel: { fontSize: 10, color: "#6B7280" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  rowTitle: { fontSize: 14, fontWeight: "600", color: "#111827" },
  rowDesc: { fontSize: 12, color: "#6B7280" },
  signOutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  signOutText: { color: "#DC2626", fontWeight: "600" },
  footerInfo: { alignItems: "center", paddingVertical: 16 },
  footerVersion: { fontSize: 12, color: "#6B7280" },
  footerNote: { fontSize: 10, color: "#9CA3AF" },
});
