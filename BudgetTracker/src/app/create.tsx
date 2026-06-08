import Feather from "@expo/vector-icons/Feather";
import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabScreenWrapper } from "./_layout";

type TransactionType = "income" | "expense";

const COLORS = {
  bg: "#111111",
  card: "#1a1a1a",
  border: "#222222",
  border2: "#2a2a2a",
  white: "#ffffff",
  subtext: "#555555",
  dim: "#444444",
  green: "#50c88c",
  greenMuted: "rgba(80,200,140,0.12)",
  red: "#ff6464",
  redMuted: "rgba(255,100,100,0.12)",
};

const INCOME_CATEGORIES = [
  { label: "Salary", icon: "briefcase" },
  { label: "Freelance", icon: "code" },
  { label: "Investment", icon: "trending-up" },
  { label: "Gift", icon: "gift" },
  { label: "Other", icon: "more-horizontal" },
] as const;

const EXPENSE_CATEGORIES = [
  { label: "Food", icon: "coffee" },
  { label: "Transport", icon: "navigation" },
  { label: "Bills", icon: "file-text" },
  { label: "Shopping", icon: "shopping-bag" },
  { label: "Health", icon: "heart" },
  { label: "Other", icon: "more-horizontal" },
] as const;

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "back"],
];

export default function CreateScreen() {
  const [type, setType] = useState<TransactionType>("income");
  const [rawAmount, setRawAmount] = useState("0");
  const [category, setCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const accent = type === "income" ? COLORS.green : COLORS.red;
  const accentMuted = type === "income" ? COLORS.greenMuted : COLORS.redMuted;
  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (t: TransactionType) => {
    setType(t);
    setRawAmount("0");
    setCategory(null);
  };

  const pressKey = useCallback((key: string) => {
    setRawAmount((prev) => {
      if (key === "back") return prev.length > 1 ? prev.slice(0, -1) : "0";
      if (key === ".") return prev.includes(".") ? prev : prev + ".";
      if (prev.includes(".") && prev.split(".")[1].length >= 2) return prev;
      return prev === "0" ? key : prev + key;
    });
  }, []);

  const formatDisplay = () => {
    const parts = rawAmount.split(".");
    const intPart = parseInt(parts[0]).toLocaleString();
    return "$" + intPart + (parts.length > 1 ? "." + parts[1] : "");
  };

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <TabScreenWrapper>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>New Transaction</Text>
            <TouchableOpacity style={styles.closeBtn}>
              <Feather name="x" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Type Toggle */}
          <View style={styles.toggle}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                type === "income" && { backgroundColor: COLORS.green },
              ]}
              onPress={() => handleTypeChange("income")}
            >
              <Text
                style={[
                  styles.toggleText,
                  type === "income" && { color: COLORS.white },
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                type === "expense" && { backgroundColor: COLORS.red },
              ]}
              onPress={() => handleTypeChange("expense")}
            >
              <Text
                style={[
                  styles.toggleText,
                  type === "expense" && { color: COLORS.white },
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount Display */}
          <View style={styles.amountArea}>
            <Text style={styles.amountLabel}>AMOUNT</Text>
            <Text style={[styles.amountValue, { color: accent }]}>
              {formatDisplay()}
            </Text>
          </View>

          {/* Category Picker */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CATEGORY</Text>
            <View style={styles.chips}>
              {categories.map((cat) => {
                const selected = category === cat.label;
                return (
                  <TouchableOpacity
                    key={cat.label}
                    style={[
                      styles.chip,
                      selected && {
                        backgroundColor: accentMuted,
                        borderColor: accent,
                      },
                    ]}
                    onPress={() => setCategory(cat.label)}
                  >
                    <Feather
                      name={cat.icon as any}
                      size={14}
                      color={selected ? accent : COLORS.subtext}
                    />
                    <Text
                      style={[styles.chipText, selected && { color: accent }]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Details */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DETAILS</Text>
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Feather name="edit-2" size={18} color={COLORS.dim} />
                  <Text style={styles.detailLabel}>Description</Text>
                </View>
                <TextInput
                  style={styles.detailInput}
                  placeholder="Add note..."
                  placeholderTextColor="#333"
                  value={description}
                  onChangeText={setDescription}
                  returnKeyType="done"
                />
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Feather name="calendar" size={18} color={COLORS.dim} />
                  <Text style={styles.detailLabel}>Date</Text>
                </View>
                <Text style={styles.detailValue}>{today}</Text>
              </View>
            </View>
          </View>

          {/* Numpad */}
          <View style={styles.numpad}>
            {KEYS.map((row, ri) => (
              <View key={ri} style={styles.numpadRow}>
                {row.map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.numKey}
                    onPress={() => pressKey(key)}
                    activeOpacity={0.6}
                  >
                    {key === "back" ? (
                      <Feather name="delete" size={20} color="#888" />
                    ) : (
                      <Text style={styles.numKeyText}>{key}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: accent }]}
            activeOpacity={0.8}
          >
            <Text style={styles.submitText}>Save Transaction</Text>
          </TouchableOpacity>
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
    paddingTop: 12,
    marginBottom: 28,
  },
  title: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border2,
    alignItems: "center",
    justifyContent: "center",
  },

  toggle: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 6,
    flexDirection: "row",
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 32,
  },
  toggleBtn: { flex: 1, borderRadius: 12, padding: 12, alignItems: "center" },
  toggleText: { fontSize: 14, fontWeight: "700", color: COLORS.subtext },

  amountArea: { alignItems: "center", paddingVertical: 8, marginBottom: 28 },
  amountLabel: {
    color: COLORS.subtext,
    fontSize: 12,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  amountValue: { fontSize: 52, fontWeight: "700", letterSpacing: -2 },

  section: { marginBottom: 24 },
  sectionLabel: {
    color: COLORS.subtext,
    fontSize: 12,
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border2,
  },
  chipText: { color: COLORS.subtext, fontSize: 13 },

  detailsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  detailLabel: { color: COLORS.subtext, fontSize: 14 },
  detailInput: {
    color: "#888",
    fontSize: 14,
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  detailValue: { color: "#888", fontSize: 14 },
  divider: { height: 1, backgroundColor: COLORS.border },

  numpad: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
    marginBottom: 24,
  },
  numpadRow: { flexDirection: "row", gap: 4 },
  numKey: {
    flex: 1,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  numKeyText: { color: COLORS.white, fontSize: 20, fontWeight: "500" },

  submitBtn: {
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: { color: COLORS.white, fontSize: 16, fontWeight: "700" },
});
