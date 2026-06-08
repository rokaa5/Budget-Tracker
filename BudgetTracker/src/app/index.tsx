import Feather from "@expo/vector-icons/Feather";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabScreenWrapper } from "./_layout";

const COLORS = {
  bg: "#111111",
  card: "#1a1a1a",
  cardDeep: "#1e1a3a",
  purple: "#8c78ff",
  purpleMuted: "rgba(140,120,255,0.15)",
  green: "#50c88c",
  greenMuted: "rgba(80,200,140,0.12)",
  red: "#ff6464",
  redMuted: "rgba(255,100,100,0.12)",
  white: "#ffffff",
  subtext: "#888888",
  dim: "#555555",
  border: "rgba(255,255,255,0.06)",
  purpleBorder: "rgba(140,120,255,0.2)",
};

const BALANCE = 25;
const INCOME = 1231231;
const EXPENSES = 1231206;

const fmt = (n: number) => `$${n.toLocaleString()}`;

const transactions = [
  {
    id: "1",
    label: "Salary Deposit",
    time: "Today, 9:41 AM",
    amount: 4200,
    icon: "briefcase" as const,
  },
  {
    id: "2",
    label: "Grocery Store",
    time: "Yesterday, 2:15 PM",
    amount: -86,
    icon: "shopping-cart" as const,
  },
  {
    id: "3",
    label: "Netflix",
    time: "Jun 1, 12:00 AM",
    amount: -15.99,
    icon: "tv" as const,
  },
];

function QuickAction({
  icon,
  label,
  color,
}: {
  icon: any;
  label: string;
  color: string;
}) {
  return (
    <TouchableOpacity style={styles.quickAction}>
      <Feather name={icon} size={20} color={color} />
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function TransactionRow({
  label,
  time,
  amount,
  icon,
}: (typeof transactions)[0]) {
  const positive = amount > 0;
  return (
    <View style={styles.txRow}>
      <View
        style={[
          styles.txIcon,
          { backgroundColor: positive ? COLORS.greenMuted : COLORS.redMuted },
        ]}
      >
        <Feather
          name={icon}
          size={18}
          color={positive ? COLORS.green : COLORS.red}
        />
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txLabel}>{label}</Text>
        <Text style={styles.txTime}>{time}</Text>
      </View>
      <Text
        style={[
          styles.txAmount,
          { color: positive ? COLORS.green : COLORS.red },
        ]}
      >
        {positive ? "+" : ""}
        {fmt(amount)}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <TabScreenWrapper>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>GOOD MORNING</Text>
              <Text style={styles.name}>Ara 👋</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>{fmt(BALANCE)}</Text>
            <Text style={styles.balanceSub}>↑ Updated just now</Text>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <View style={styles.statHeader}>
                  <View
                    style={[
                      styles.statIcon,
                      { backgroundColor: COLORS.greenMuted },
                    ]}
                  >
                    <Feather name="arrow-down" size={13} color={COLORS.green} />
                  </View>
                  <Text style={styles.statLabel}>INCOME</Text>
                </View>
                <Text style={[styles.statAmount, { color: COLORS.green }]}>
                  {fmt(INCOME)}
                </Text>
              </View>
              <View style={styles.statBox}>
                <View style={styles.statHeader}>
                  <View
                    style={[
                      styles.statIcon,
                      { backgroundColor: COLORS.redMuted },
                    ]}
                  >
                    <Feather name="arrow-up" size={13} color={COLORS.red} />
                  </View>
                  <Text style={styles.statLabel}>EXPENSES</Text>
                </View>
                <Text style={[styles.statAmount, { color: COLORS.red }]}>
                  {fmt(EXPENSES)}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickRow}>
            <QuickAction icon="plus" label="Add Income" color={COLORS.purple} />
            <QuickAction icon="minus" label="Add Expense" color={COLORS.red} />
            <QuickAction
              icon="trending-up"
              label="Analytics"
              color={COLORS.green}
            />
          </View>

          {/* Transactions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <Text style={styles.seeAll}>See all</Text>
            </View>
            <View style={styles.txList}>
              {transactions.map((tx) => (
                <TransactionRow key={tx.id} {...tx} />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 100 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 24,
  },
  greeting: { color: COLORS.subtext, fontSize: 12, letterSpacing: 1 },
  name: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginTop: 2,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#5d4fe8",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: COLORS.white, fontWeight: "700", fontSize: 16 },

  balanceCard: {
    backgroundColor: "#1e1a3a",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.purpleBorder,
  },
  balanceLabel: {
    color: COLORS.purple,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  balanceAmount: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: -1,
  },
  balanceSub: {
    color: COLORS.dim,
    fontSize: 12,
    marginTop: 6,
    marginBottom: 20,
  },
  statsRow: { flexDirection: "row", gap: 12 },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  statIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: { color: COLORS.subtext, fontSize: 10, letterSpacing: 0.5 },
  statAmount: { fontSize: 15, fontWeight: "700" },

  quickRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  quickAction: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickLabel: { color: COLORS.subtext, fontSize: 11, marginTop: 4 },

  section: { marginTop: 24 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: { color: COLORS.white, fontSize: 16, fontWeight: "600" },
  seeAll: { color: COLORS.purple, fontSize: 13 },
  txList: { gap: 8 },
  txRow: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  txInfo: { flex: 1 },
  txLabel: { color: COLORS.white, fontSize: 14, fontWeight: "500" },
  txTime: { color: COLORS.dim, fontSize: 12, marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: "600" },
});
