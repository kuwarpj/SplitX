import { Button } from '@/components/ui/Button';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function HomeScreen({ navigation }: any) {

  const [totalOwed] = useState(245.5);
  const [totalOwe] = useState(89.25);

  const [friendBalances] = useState([
    { id: '1', name: 'Alex Johnson', balance: 125.5, lastActivity: '2 days ago' },
    { id: '2', name: 'Sarah Chen', balance: -45.25, lastActivity: '1 week ago' },
    { id: '3', name: 'Mike Rodriguez', balance: 89.75, lastActivity: '3 days ago' },
    { id: '4', name: 'Emma Wilson', balance: -44.0, lastActivity: '5 days ago' },
  ]);

  const netBalance = totalOwed - totalOwe;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Feather name="dollar-sign" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.title}>ShareBills</Text>
            <Text style={styles.subtitle}>Welcome back, John</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={20} color="#444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={20} color="#444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.centerText}>Your net balance</Text>
        <Text style={[styles.netBalance, { color: netBalance >= 0 ? 'green' : 'red' }]}>${Math.abs(netBalance).toFixed(2)}</Text>
        <Text style={styles.centerSubText}>
          {netBalance >= 0 ? 'You are owed overall' : 'You owe overall'}
        </Text>

        <View style={styles.balanceRow}>
          <View style={styles.balanceBox}>
            <Text style={styles.label}>You're owed</Text>
            <Text style={styles.amountGreen}>${totalOwed.toFixed(2)}</Text>
          </View>
          <View style={styles.balanceBox}>
            <Text style={styles.label}>You owe</Text>
            <Text style={styles.amountRed}>${totalOwe.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <Button label="Add Expense" icon="add" variant="primary" />
        <Button label="Settle Up" icon="handshake-outline" variant="outline" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Friends</Text>
        {friendBalances.map((friend) => (
          <View key={friend.id} style={styles.friendCard}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{friend.name.split(' ').map(n => n[0]).join('')}</Text></View>
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendActivity}>{friend.lastActivity}</Text>
            </View>
            <View style={styles.balanceInfo}>
              <Text style={{ color: friend.balance > 0 ? 'green' : friend.balance < 0 ? 'red' : '#888' }}>
                {friend.balance > 0 ? '+' : ''}${Math.abs(friend.balance).toFixed(2)}
              </Text>
              <Text style={styles.friendActivity}>
                {friend.balance > 0 ? 'owes you' : friend.balance < 0 ? 'you owe' : 'settled up'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Feather name="file-text" size={20} color="#2563eb" style={styles.activityIcon} />
          <View style={styles.activityText}>
            <Text style={styles.friendName}>Dinner at Italian Restaurant</Text>
            <Text style={styles.friendActivity}>Split with Alex, Sarah, Mike • $67.50 total</Text>
            <Text style={styles.friendActivity}>2 hours ago</Text>
          </View>
          <Text style={{ color: 'red' }}>- $16.88</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f4ff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerRight: { flexDirection: 'row', gap: 8 },
  iconBox: {
    backgroundColor: '#2563eb',
    padding: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 1,
  },
  title: { fontWeight: 'bold', fontSize: 18 },
  subtitle: { fontSize: 12, color: '#666' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  centerText: { textAlign: 'center', fontSize: 14, color: '#666' },
  netBalance: { textAlign: 'center', fontSize: 28, fontWeight: 'bold' },
  centerSubText: { textAlign: 'center', fontSize: 12, color: '#888' },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
  balanceBox: { alignItems: 'center' },
  label: { fontSize: 12, color: '#444' },
  amountGreen: { fontSize: 20, color: 'green' },
  amountRed: { fontSize: 20, color: 'red' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  friendCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e0e7ff', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 14, fontWeight: 'bold', color: '#2563eb' },
  friendInfo: { flex: 1, marginLeft: 12 },
  friendName: { fontSize: 14, fontWeight: '500' },
  friendActivity: { fontSize: 12, color: '#888' },
  balanceInfo: { alignItems: 'flex-end' },
  activityCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10 },
  activityIcon: { marginRight: 10 },
  activityText: { flex: 1 },
});
