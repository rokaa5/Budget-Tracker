import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
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
  purpleBorder: "rgba(140,120,255,0.2)",
  green: "#50c88c",
  greenMuted: "rgba(80,200,140,0.12)",
  red: "#ff6464",
  redMuted: "rgba(255,100,100,0.12)",
  amber: "#f5a623",
  amberMuted: "rgba(245,166,35,0.12)",
  blue: "#5eaeff",
  blueMuted: "rgba(94,174,255,0.12)",
  white: "#ffffff",
  subtext: "#888888",
  dim: "#444444",
  border: "rgba(255,255,255,0.06)",
  purpleDim: "rgba(140,120,255,0.35)",
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Period = "Today" | "Week" | "Month" | "Year";

interface Transaction {
  id: string;
  label: string;
  time: string;
  amount: number;
  icon: string;
  category: string;
}

// ─── Mock data per period ─────────────────────────────────────────────────────
// Replace these with your real data layer.

const DATA: Record<
  Period,
  {
    balance: number;
    income: number;
    expenses: number;
    budgetLimit: number;
    transactions: Transaction[];
    categoryBreakdown: {
      label: string;
      amount: number;
      color: string;
      icon: string;
    }[];
  }
> = {
  Today: {
    balance: 25,
    income: 4200,
    expenses: 4175,
    budgetLimit: 150,
    transactions: [
      {
        id: "1",
        label: "Salary Deposit",
        time: "Today, 9:41 AM",
        amount: 4200,
        icon: "briefcase",
        category: "Income",
      },
      {
        id: "2",
        label: "Grocery Store",
        time: "Today, 2:15 PM",
        amount: -86,
        icon: "shopping-cart",
        category: "Food",
      },
      {
        id: "3",
        label: "Netflix",
        time: "Today, 12:00 AM",
        amount: -15.99,
        icon: "tv",
        category: "Bills",
      },
      {
        id: "4",
        label: "Grab Ride",
        time: "Today, 8:10 AM",
        amount: -12,
        icon: "navigation",
        category: "Transport",
      },
    ],
    categoryBreakdown: [
      { label: "Food", amount: 86, color: COLORS.amber, icon: "coffee" },
      { label: "Bills", amount: 15.99, color: COLORS.red, icon: "file-text" },
      {
        label: "Transport",
        amount: 12,
        color: COLORS.blue,
        icon: "navigation",
      },
    ],
  },
  Week: {
    balance: 1240,
    income: 4200,
    expenses: 2960,
    budgetLimit: 3500,
    transactions: [
      {
        id: "1",
        label: "Salary Deposit",
        time: "Mon, 9:41 AM",
        amount: 4200,
        icon: "briefcase",
        category: "Income",
      },
      {
        id: "2",
        label: "Grocery Store",
        time: "Tue, 2:15 PM",
        amount: -320,
        icon: "shopping-cart",
        category: "Food",
      },
      {
        id: "3",
        label: "Electric Bill",
        time: "Wed, 10:00 AM",
        amount: -980,
        icon: "zap",
        category: "Bills",
      },
      {
        id: "4",
        label: "Grab Rides",
        time: "Thu, 8:10 AM",
        amount: -210,
        icon: "navigation",
        category: "Transport",
      },
      {
        id: "5",
        label: "Dinner out",
        time: "Fri, 7:30 PM",
        amount: -450,
        icon: "coffee",
        category: "Food",
      },
      {
        id: "6",
        label: "Gym",
        time: "Sat, 6:00 AM",
        amount: -1000,
        icon: "heart",
        category: "Health",
      },
    ],
    categoryBreakdown: [
      { label: "Food", amount: 770, color: COLORS.amber, icon: "coffee" },
      { label: "Bills", amount: 980, color: COLORS.red, icon: "file-text" },
      {
        label: "Transport",
        amount: 210,
        color: COLORS.blue,
        icon: "navigation",
      },
      { label: "Health", amount: 1000, color: COLORS.green, icon: "heart" },
    ],
  },
  Month: {
    balance: 5480,
    income: 18500,
    expenses: 13020,
    budgetLimit: 15000,
    transactions: [
      {
        id: "1",
        label: "Salary Deposit",
        time: "Jun 1",
        amount: 12000,
        icon: "briefcase",
        category: "Income",
      },
      {
        id: "2",
        label: "Freelance Project",
        time: "Jun 8",
        amount: 6500,
        icon: "code",
        category: "Income",
      },
      {
        id: "3",
        label: "Rent",
        time: "Jun 2",
        amount: -8000,
        icon: "home",
        category: "Bills",
      },
      {
        id: "4",
        label: "Groceries",
        time: "Jun 5",
        amount: -1240,
        icon: "shopping-cart",
        category: "Food",
      },
      {
        id: "5",
        label: "Transport",
        time: "Jun 10",
        amount: -780,
        icon: "navigation",
        category: "Transport",
      },
      {
        id: "6",
        label: "Subscriptions",
        time: "Jun 1",
        amount: -3000,
        icon: "tv",
        category: "Bills",
      },
    ],
    categoryBreakdown: [
      { label: "Bills", amount: 11000, color: COLORS.red, icon: "file-text" },
      { label: "Food", amount: 1240, color: COLORS.amber, icon: "coffee" },
      {
        label: "Transport",
        amount: 780,
        color: COLORS.blue,
        icon: "navigation",
      },
    ],
  },
  Year: {
    balance: 42300,
    income: 198000,
    expenses: 155700,
    budgetLimit: 160000,
    transactions: [
      {
        id: "1",
        label: "Total Salary",
        time: "Jan–Jun",
        amount: 144000,
        icon: "briefcase",
        category: "Income",
      },
      {
        id: "2",
        label: "Freelance",
        time: "Various",
        amount: 54000,
        icon: "code",
        category: "Income",
      },
      {
        id: "3",
        label: "Rent",
        time: "Jan–Jun",
        amount: -96000,
        icon: "home",
        category: "Bills",
      },
      {
        id: "4",
        label: "Groceries",
        time: "Jan–Jun",
        amount: -18600,
        icon: "shopping-cart",
        category: "Food",
      },
      {
        id: "5",
        label: "Transport",
        time: "Jan–Jun",
        amount: -14400,
        icon: "navigation",
        category: "Transport",
      },
      {
        id: "6",
        label: "Health",
        time: "Jan–Jun",
        amount: -26700,
        icon: "heart",
        category: "Health",
      },
    ],
    categoryBreakdown: [
      { label: "Bills", amount: 96000, color: COLORS.red, icon: "file-text" },
      { label: "Health", amount: 26700, color: COLORS.green, icon: "heart" },
      { label: "Food", amount: 18600, color: COLORS.amber, icon: "coffee" },
      {
        label: "Transport",
        amount: 14400,
        color: COLORS.blue,
        icon: "navigation",
      },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(abs / 1_000).toFixed(1)}K`;
  return `$${abs.toLocaleString()}`;
};

const fmtFull = (n: number) => `$${Math.abs(n).toLocaleString()}`;

// ─── Period pill ──────────────────────────────────────────────────────────────

function PeriodFilter({
  active,
  onChange,
}: {
  active: Period;
  onChange: (p: Period) => void;
}) {
  const periods: Period[] = ["Today", "Week", "Month", "Year"];
  return (
    <View style={styles.periodRow}>
      {periods.map((p) => (
        <TouchableOpacity
          key={p}
          style={[styles.periodPill, active === p && styles.periodPillActive]}
          onPress={() => onChange(p)}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.periodText, active === p && styles.periodTextActive]}
          >
            {p}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Budget progress ──────────────────────────────────────────────────────────

function BudgetProgress({ spent, limit }: { spent: number; limit: number }) {
  const pct = Math.min(spent / limit, 1);
  const over = pct >= 1;
  const barColor =
    pct > 0.85 ? COLORS.red : pct > 0.6 ? COLORS.amber : COLORS.green;

  return (
    <View style={styles.budgetBox}>
      <View style={styles.budgetHeader}>
        <Text style={styles.budgetLabel}>Budget Used</Text>
        <Text style={[styles.budgetValue, over && { color: COLORS.red }]}>
          {fmt(spent)} <Text style={styles.budgetOf}>/ {fmt(limit)}</Text>
        </Text>
      </View>
      <View style={styles.budgetTrack}>
        <View
          style={[
            styles.budgetFill,
            { width: `${pct * 100}%` as any, backgroundColor: barColor },
          ]}
        />
      </View>
      {over && (
        <Text style={styles.budgetWarn}>
          ⚠ Over budget by {fmt(spent - limit)}
        </Text>
      )}
    </View>
  );
}

// ─── Category breakdown bar chart ─────────────────────────────────────────────

function CategoryBreakdown({
  items,
}: {
  items: { label: string; amount: number; color: string; icon: string }[];
}) {
  if (items.length === 0) return null;
  const total = items.reduce((s, i) => s + i.amount, 0);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>
      </View>

      {/* Stacked bar */}
      <View style={styles.stackedBar}>
        {items.map((item, idx) => (
          <View
            key={item.label}
            style={[
              styles.stackedSegment,
              {
                flex: item.amount / total,
                backgroundColor: item.color,
                borderTopLeftRadius: idx === 0 ? 6 : 0,
                borderBottomLeftRadius: idx === 0 ? 6 : 0,
                borderTopRightRadius: idx === items.length - 1 ? 6 : 0,
                borderBottomRightRadius: idx === items.length - 1 ? 6 : 0,
              },
            ]}
          />
        ))}
      </View>

      {/* Legend rows */}
      <View style={styles.catList}>
        {items.map((item) => {
          const pct = Math.round((item.amount / total) * 100);
          const barW = `${pct}%`;
          return (
            <View key={item.label} style={styles.catRow}>
              <View
                style={[styles.catIcon, { backgroundColor: item.color + "22" }]}
              >
                <Feather name={item.icon as any} size={13} color={item.color} />
              </View>
              <View style={styles.catInfo}>
                <View style={styles.catLabelRow}>
                  <Text style={styles.catLabel}>{item.label}</Text>
                  <Text style={[styles.catAmount, { color: item.color }]}>
                    {fmt(item.amount)}
                  </Text>
                </View>
                <View style={styles.catTrack}>
                  <View
                    style={[
                      styles.catFill,
                      { width: barW as any, backgroundColor: item.color },
                    ]}
                  />
                </View>
              </View>
              <Text style={styles.catPct}>{pct}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyTransactions({ period }: { period: Period }) {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIcon}>
        <Feather name="inbox" size={28} color={COLORS.dim} />
      </View>
      <Text style={styles.emptyTitle}>No transactions</Text>
      <Text style={styles.emptyBody}>
        Nothing recorded{" "}
        {period === "Today" ? "today" : `this ${period.toLowerCase()}`}.{"\n"}
        Tap + to add your first entry.
      </Text>
    </View>
  );
}

// ─── Transaction row ──────────────────────────────────────────────────────────

function TransactionRow({ label, time, amount, icon }: Transaction) {
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
          name={icon as any}
          size={17}
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
        {positive ? "+" : "-"}
        {fmtFull(amount)}
      </Text>
    </View>
  );
}

// ─── Quick action ─────────────────────────────────────────────────────────────

function QuickAction({
  icon,
  label,
  color,
  onPress,
}: {
  icon: any;
  label: string;
  color: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.quickAction}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Feather name={icon} size={20} color={color} />
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [period, setPeriod] = useState<Period>("Month");
  const d = DATA[period];
  const hasTransactions = d.transactions.length > 0;

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

          {/* Period filter */}
          <PeriodFilter active={period} onChange={setPeriod} />

          {/* Balance card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>{fmtFull(d.balance)}</Text>
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
                  {fmt(d.income)}
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
                  {fmt(d.expenses)}
                </Text>
              </View>
            </View>

            {/* Budget progress — inside balance card */}
            <BudgetProgress spent={d.expenses} limit={d.budgetLimit} />
          </View>

          {/* Quick actions */}
          <View style={styles.quickRow}>
            <QuickAction icon="plus" label="Add Income" color={COLORS.purple} />
            <QuickAction icon="minus" label="Add Expense" color={COLORS.red} />
            <QuickAction
              icon="trending-up"
              label="Analytics"
              color={COLORS.green}
            />
          </View>

          {/* Category breakdown */}
          {hasTransactions && <CategoryBreakdown items={d.categoryBreakdown} />}

          {/* Transactions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              {hasTransactions && (
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
              )}
            </View>

            {hasTransactions ? (
              <View style={styles.txList}>
                {d.transactions.slice(0, 5).map((tx) => (
                  <TransactionRow key={tx.id} {...tx} />
                ))}
              </View>
            ) : (
              <EmptyTransactions period={period} />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </TabScreenWrapper>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 100 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 20,
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

  // Period filter
  periodRow: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  periodPill: {
    flex: 1,
    borderRadius: 9,
    paddingVertical: 8,
    alignItems: "center",
  },
  periodPillActive: {
    backgroundColor: COLORS.purpleMuted,
    borderWidth: 1,
    borderColor: COLORS.purpleBorder,
  },
  periodText: { color: COLORS.subtext, fontSize: 13, fontWeight: "500" },
  periodTextActive: { color: COLORS.purple, fontWeight: "700" },

  // Balance card
  balanceCard: {
    backgroundColor: "#1e1a3a",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.purpleBorder,
    marginBottom: 14,
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

  // Budget progress
  budgetBox: { marginTop: 18 },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  budgetLabel: { color: COLORS.subtext, fontSize: 12 },
  budgetValue: { color: COLORS.white, fontSize: 13, fontWeight: "600" },
  budgetOf: { color: COLORS.dim, fontWeight: "400" },
  budgetTrack: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 3,
    overflow: "hidden",
  },
  budgetFill: { height: 6, borderRadius: 3 },
  budgetWarn: { color: COLORS.red, fontSize: 12, marginTop: 6 },

  // Quick actions
  quickRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
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

  // Sections
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: { color: COLORS.white, fontSize: 16, fontWeight: "600" },
  seeAll: { color: COLORS.purple, fontSize: 13 },

  // Stacked bar
  stackedBar: {
    flexDirection: "row",
    height: 10,
    borderRadius: 6,
    overflow: "hidden",
    gap: 2,
    marginBottom: 16,
  },
  stackedSegment: { height: 10 },

  // Category list
  catList: { gap: 12 },
  catRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  catIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  catInfo: { flex: 1, gap: 5 },
  catLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  catLabel: { color: COLORS.white, fontSize: 13, fontWeight: "500" },
  catAmount: { fontSize: 13, fontWeight: "600" },
  catTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 2,
    overflow: "hidden",
  },
  catFill: { height: 4, borderRadius: 2 },
  catPct: { color: COLORS.dim, fontSize: 12, width: 32, textAlign: "right" },

  // Transactions
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

  // Empty state
  emptyWrap: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 40,
    alignItems: "center",
    gap: 10,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { color: COLORS.white, fontSize: 15, fontWeight: "600" },
  emptyBody: {
    color: COLORS.subtext,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 32,
  },
});
