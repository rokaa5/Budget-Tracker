import Feather from "@expo/vector-icons/Feather";
import { useCallback, useState } from "react";
import {
  Modal,
  Pressable,
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
type RecurringInterval = "none" | "daily" | "weekly" | "monthly" | "yearly";

const COLORS = {
  bg: "#111111",
  card: "#1a1a1a",
  border: "#222222",
  border2: "#2a2a2a",
  white: "#ffffff",
  subtext: "#555555",
  subtext2: "#888888",
  dim: "#444444",
  green: "#50c88c",
  greenMuted: "rgba(80,200,140,0.12)",
  red: "#ff6464",
  redMuted: "rgba(255,100,100,0.12)",
  purple: "#8c78ff",
  purpleMuted: "rgba(140,120,255,0.15)",
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

const RECURRING_OPTIONS: {
  label: string;
  value: RecurringInterval;
  icon: string;
}[] = [
  { label: "None", value: "none", icon: "x" },
  { label: "Daily", value: "daily", icon: "sun" },
  { label: "Weekly", value: "weekly", icon: "calendar" },
  { label: "Monthly", value: "monthly", icon: "repeat" },
  { label: "Yearly", value: "yearly", icon: "rotate-cw" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDisplayAmount(raw: string) {
  const parts = raw.split(".");
  const intPart = parseInt(parts[0]).toLocaleString();
  return "$" + intPart + (parts.length > 1 ? "." + parts[1] : "");
}

function buildCalendar(year: number, month: number) {
  // month is 0-indexed
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// ─── Date picker modal ────────────────────────────────────────────────────────

function DatePickerModal({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: Date;
  onSelect: (d: Date) => void;
  onClose: () => void;
}) {
  const [viewYear, setViewYear] = useState(selected.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected.getMonth());

  const cells = buildCalendar(viewYear, viewMonth);
  const today = new Date();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const isSelected = (d: number) =>
    d === selected.getDate() &&
    viewMonth === selected.getMonth() &&
    viewYear === selected.getFullYear();

  const isToday = (d: number) =>
    d === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={dpStyles.overlay} onPress={onClose}>
        <Pressable style={dpStyles.sheet} onPress={() => {}}>
          {/* Month nav */}
          <View style={dpStyles.nav}>
            <TouchableOpacity onPress={prevMonth} style={dpStyles.navBtn}>
              <Feather name="chevron-left" size={18} color="#fff" />
            </TouchableOpacity>
            <Text style={dpStyles.navTitle}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={dpStyles.navBtn}>
              <Feather name="chevron-right" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Day labels */}
          <View style={dpStyles.dayRow}>
            {DAY_LABELS.map((l) => (
              <Text key={l} style={dpStyles.dayLabel}>
                {l}
              </Text>
            ))}
          </View>

          {/* Grid */}
          <View style={dpStyles.grid}>
            {cells.map((cell, idx) => {
              if (cell === null) {
                return <View key={`empty-${idx}`} style={dpStyles.cell} />;
              }
              const sel = isSelected(cell);
              const tod = isToday(cell);
              return (
                <TouchableOpacity
                  key={`day-${idx}`}
                  style={[
                    dpStyles.cell,
                    sel && dpStyles.cellSelected,
                    !sel && tod && dpStyles.cellToday,
                  ]}
                  onPress={() => {
                    onSelect(new Date(viewYear, viewMonth, cell));
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      dpStyles.cellText,
                      sel && dpStyles.cellTextSelected,
                      !sel && tod && dpStyles.cellTextToday,
                    ]}
                  >
                    {cell}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Quick selectors */}
          <View style={dpStyles.quickRow}>
            {["Today", "Yesterday"].map((label) => {
              const d = new Date();
              if (label === "Yesterday") d.setDate(d.getDate() - 1);
              return (
                <TouchableOpacity
                  key={label}
                  style={dpStyles.quickBtn}
                  onPress={() => {
                    onSelect(d);
                    onClose();
                  }}
                >
                  <Text style={dpStyles.quickBtnText}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Success toast ────────────────────────────────────────────────────────────

function SuccessToast({ type }: { type: TransactionType }) {
  return (
    <View
      style={[
        toastStyles.wrap,
        { borderColor: type === "income" ? COLORS.green : COLORS.red },
      ]}
    >
      <View
        style={[
          toastStyles.icon,
          {
            backgroundColor:
              type === "income" ? COLORS.greenMuted : COLORS.redMuted,
          },
        ]}
      >
        <Feather
          name="check"
          size={18}
          color={type === "income" ? COLORS.green : COLORS.red}
        />
      </View>
      <View style={toastStyles.text}>
        <Text style={toastStyles.title}>Transaction saved!</Text>
        <Text style={toastStyles.body}>Your {type} has been recorded.</Text>
      </View>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function CreateScreen() {
  const [type, setType] = useState<TransactionType>("income");
  const [rawAmount, setRawAmount] = useState("0");
  const [category, setCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [recurring, setRecurring] = useState<RecurringInterval>("none");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRecurring, setShowRecurring] = useState(false);
  const [saved, setSaved] = useState(false);

  const accent = type === "income" ? COLORS.green : COLORS.red;
  const accentMuted = type === "income" ? COLORS.greenMuted : COLORS.redMuted;
  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (t: TransactionType) => {
    setType(t);
    setRawAmount("0");
    setCategory(null);
    setSaved(false);
  };

  const pressKey = useCallback((key: string) => {
    setRawAmount((prev) => {
      if (key === "back") return prev.length > 1 ? prev.slice(0, -1) : "0";
      if (key === ".") return prev.includes(".") ? prev : prev + ".";
      if (prev.includes(".") && prev.split(".")[1].length >= 2) return prev;
      return prev === "0" ? key : prev + key;
    });
  }, []);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const isToday = (d: Date) => {
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };

  const recurringLabel =
    recurring === "none"
      ? "One-time"
      : (RECURRING_OPTIONS.find((o) => o.value === recurring)?.label ??
        "One-time");

  const handleSave = () => {
    // Wire your data layer here — all values are ready:
    // { type, amount: parseFloat(rawAmount), category, description, date: selectedDate, recurring }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setRawAmount("0");
      setCategory(null);
      setDescription("");
      setSelectedDate(new Date());
      setRecurring("none");
    }, 2200);
  };

  return (
    <TabScreenWrapper>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>New Transaction</Text>
            <TouchableOpacity style={styles.closeBtn}>
              <Feather name="x" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Success toast */}
          {saved && <SuccessToast type={type} />}

          {/* Type toggle */}
          <View style={styles.toggle}>
            {(["income", "expense"] as TransactionType[]).map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.toggleBtn,
                  type === t && {
                    backgroundColor: t === "income" ? COLORS.green : COLORS.red,
                  },
                ]}
                onPress={() => handleTypeChange(t)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    type === t && { color: COLORS.white },
                  ]}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Amount display */}
          <View style={styles.amountArea}>
            <Text style={styles.amountLabel}>AMOUNT</Text>
            <Text style={[styles.amountValue, { color: accent }]}>
              {formatDisplayAmount(rawAmount)}
            </Text>
          </View>

          {/* Category picker */}
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

          {/* Details: description + date + recurring */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DETAILS</Text>
            <View style={styles.detailsCard}>
              {/* Description */}
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Feather name="edit-2" size={17} color={COLORS.dim} />
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

              <View style={styles.innerDivider} />

              {/* Date */}
              <TouchableOpacity
                style={styles.detailRow}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <View style={styles.detailLeft}>
                  <Feather name="calendar" size={17} color={COLORS.dim} />
                  <Text style={styles.detailLabel}>Date</Text>
                </View>
                <View style={styles.detailRight}>
                  {isToday(selectedDate) && (
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayBadgeText}>Today</Text>
                    </View>
                  )}
                  <Text style={styles.detailValue}>
                    {formatDate(selectedDate)}
                  </Text>
                  <Feather name="chevron-right" size={14} color="#444" />
                </View>
              </TouchableOpacity>

              <View style={styles.innerDivider} />

              {/* Recurring */}
              <TouchableOpacity
                style={styles.detailRow}
                onPress={() => setShowRecurring((v) => !v)}
                activeOpacity={0.7}
              >
                <View style={styles.detailLeft}>
                  <Feather name="repeat" size={17} color={COLORS.dim} />
                  <Text style={styles.detailLabel}>Recurring</Text>
                </View>
                <View style={styles.detailRight}>
                  {recurring !== "none" && (
                    <View
                      style={[
                        styles.todayBadge,
                        {
                          backgroundColor: COLORS.purpleMuted,
                          borderColor: "rgba(140,120,255,0.3)",
                        },
                      ]}
                    >
                      <Text
                        style={[styles.todayBadgeText, { color: "#8c78ff" }]}
                      >
                        Active
                      </Text>
                    </View>
                  )}
                  <Text style={styles.detailValue}>{recurringLabel}</Text>
                  <Feather
                    name={showRecurring ? "chevron-up" : "chevron-down"}
                    size={14}
                    color="#444"
                  />
                </View>
              </TouchableOpacity>

              {/* Recurring options (inline expand) */}
              {showRecurring && (
                <View style={styles.recurringGrid}>
                  {RECURRING_OPTIONS.map((opt) => {
                    const active = recurring === opt.value;
                    return (
                      <TouchableOpacity
                        key={opt.value}
                        style={[
                          styles.recurringOption,
                          active && {
                            backgroundColor: accentMuted,
                            borderColor: accent,
                          },
                        ]}
                        onPress={() => {
                          setRecurring(opt.value);
                          setShowRecurring(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Feather
                          name={opt.icon as any}
                          size={14}
                          color={active ? accent : COLORS.subtext}
                        />
                        <Text
                          style={[
                            styles.recurringLabel,
                            active && { color: accent },
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
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
            style={[
              styles.submitBtn,
              { backgroundColor: accent },
              saved && styles.submitSaved,
            ]}
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={saved}
          >
            {saved ? (
              <View style={styles.submitRow}>
                <Feather name="check-circle" size={18} color={COLORS.white} />
                <Text style={styles.submitText}>Saved!</Text>
              </View>
            ) : (
              <Text style={styles.submitText}>
                Save {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      {/* Date picker modal */}
      <DatePickerModal
        visible={showDatePicker}
        selected={selectedDate}
        onSelect={setSelectedDate}
        onClose={() => setShowDatePicker(false)}
      />
    </TabScreenWrapper>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 100 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    marginBottom: 20,
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
    marginBottom: 28,
  },
  toggleBtn: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  toggleText: { fontSize: 14, fontWeight: "700", color: COLORS.subtext },

  amountArea: {
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 28,
  },
  amountLabel: {
    color: COLORS.subtext,
    fontSize: 12,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  amountValue: { fontSize: 52, fontWeight: "700", letterSpacing: -2 },

  section: { marginBottom: 22 },
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
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  detailLabel: { color: COLORS.subtext, fontSize: 14 },
  detailInput: {
    color: "#888",
    fontSize: 14,
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  detailRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailValue: { color: "#888", fontSize: 13 },
  innerDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },

  todayBadge: {
    backgroundColor: "rgba(80,200,140,0.12)",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "rgba(80,200,140,0.25)",
  },
  todayBadgeText: { color: COLORS.green, fontSize: 10, fontWeight: "600" },

  recurringGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  recurringOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#111",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border2,
  },
  recurringLabel: { color: COLORS.subtext, fontSize: 13 },

  numpad: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
    marginBottom: 22,
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
    marginTop: 4,
  },
  submitSaved: { opacity: 0.85 },
  submitRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  submitText: { color: COLORS.white, fontSize: 16, fontWeight: "700" },
});

// ─── Date picker styles ───────────────────────────────────────────────────────

const dpStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  dayRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  dayLabel: {
    flex: 1,
    textAlign: "center",
    color: "#555",
    fontSize: 12,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: `${100 / 7}%` as any,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cellSelected: {
    backgroundColor: "#8c78ff",
    borderRadius: 10,
  },
  cellToday: {
    borderWidth: 1,
    borderColor: "rgba(140,120,255,0.4)",
    borderRadius: 10,
  },
  cellText: { color: "#aaa", fontSize: 14 },
  cellTextSelected: { color: "#fff", fontWeight: "700" },
  cellTextToday: { color: "#8c78ff", fontWeight: "600" },
  quickRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: "#222",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  quickBtnText: { color: "#888", fontSize: 13, fontWeight: "600" },
});

// ─── Toast styles ─────────────────────────────────────────────────────────────

const toastStyles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1 },
  title: { color: "#fff", fontSize: 14, fontWeight: "600" },
  body: { color: "#888", fontSize: 12, marginTop: 2 },
});
