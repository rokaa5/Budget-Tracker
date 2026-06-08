import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
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
  white: "#ffffff",
  subtext: "#888888",
  dim: "#555555",
  border: "rgba(255,255,255,0.06)",
  border2: "#2a2a2a",
};

// ─── Avatar initials ────────────────────────────────────────────────────────
function Avatar({ name, size = 56 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <View
      style={[
        styles.avatarCircle,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.36 }]}>
        {initials}
      </Text>
    </View>
  );
}

// ─── Section header ──────────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

// ─── Card row ────────────────────────────────────────────────────────────────
function Row({
  icon,
  iconColor,
  iconBg,
  label,
  value,
  onPress,
  danger,
  toggle,
  toggleValue,
  onToggle,
}: {
  icon: any;
  iconColor: string;
  iconBg: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={toggle ? 1 : 0.65}
    >
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
        <Feather name={icon} size={16} color={iconColor} />
      </View>
      <Text style={[styles.rowLabel, danger && { color: COLORS.red }]}>
        {label}
      </Text>
      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: COLORS.border2, true: COLORS.purple }}
          thumbColor={toggleValue ? COLORS.white : COLORS.subtext}
        />
      ) : (
        <View style={styles.rowRight}>
          {value ? <Text style={styles.rowValue}>{value}</Text> : null}
          {!danger && (
            <Feather name="chevron-right" size={16} color={COLORS.dim} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
function Divider() {
  return <View style={styles.divider} />;
}

// ─── Password modal (inline collapsible) ─────────────────────────────────────
function PasswordSection() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const handleSave = () => {
    // placeholder — wire to your auth logic
    setCurrent("");
    setNext("");
    setConfirm("");
    setOpen(false);
  };

  return (
    <>
      <Row
        icon="lock"
        iconColor={COLORS.purple}
        iconBg={COLORS.purpleMuted}
        label="Change Password"
        onPress={() => setOpen((v) => !v)}
      />
      {open && (
        <View style={styles.passwordForm}>
          {/* Current */}
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>Current password</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={current}
                onChangeText={setCurrent}
                secureTextEntry={!showCurrent}
                placeholder="••••••••"
                placeholderTextColor={COLORS.dim}
              />
              <TouchableOpacity onPress={() => setShowCurrent((v) => !v)}>
                <Feather
                  name={showCurrent ? "eye-off" : "eye"}
                  size={16}
                  color={COLORS.subtext}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* New */}
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>New password</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={next}
                onChangeText={setNext}
                secureTextEntry={!showNext}
                placeholder="••••••••"
                placeholderTextColor={COLORS.dim}
              />
              <TouchableOpacity onPress={() => setShowNext((v) => !v)}>
                <Feather
                  name={showNext ? "eye-off" : "eye"}
                  size={16}
                  color={COLORS.subtext}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* Confirm */}
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>Confirm new password</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={COLORS.dim}
              />
            </View>
          </View>
          <View style={styles.passwordActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setOpen(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

// ─── Edit profile modal (inline) ─────────────────────────────────────────────
function ProfileEditSection({
  name,
  email,
  username,
  onSave,
}: {
  name: string;
  email: string;
  username: string;
  onSave: (n: string, e: string, u: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftEmail, setDraftEmail] = useState(email);
  const [draftUsername, setDraftUsername] = useState(username);

  const handleSave = () => {
    onSave(draftName, draftEmail, draftUsername);
    setOpen(false);
  };

  return (
    <>
      <Row
        icon="edit-2"
        iconColor={COLORS.green}
        iconBg={COLORS.greenMuted}
        label="Edit Profile"
        onPress={() => setOpen((v) => !v)}
      />
      {open && (
        <View style={styles.passwordForm}>
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>Full name</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={draftName}
                onChangeText={setDraftName}
                placeholder="Your name"
                placeholderTextColor={COLORS.dim}
              />
            </View>
          </View>
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>Username</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={draftUsername}
                onChangeText={setDraftUsername}
                placeholder="@username"
                placeholderTextColor={COLORS.dim}
                autoCapitalize="none"
              />
            </View>
          </View>
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={draftEmail}
                onChangeText={setDraftEmail}
                placeholder="you@example.com"
                placeholderTextColor={COLORS.dim}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
          <View style={styles.passwordActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setOpen(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function MoreScreen() {
  const [name, setName] = useState("Ara Baby");
  const [email, setEmail] = useState("ara@example.com");
  const [username, setUsername] = useState("@arababy");

  const [biometrics, setBiometrics] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <TabScreenWrapper>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Header */}
          <Text style={styles.pageTitle}>More</Text>

          {/* ── Profile card ── */}
          <View style={styles.profileCard}>
            <Avatar name={name} size={60} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{name}</Text>
              <Text style={styles.profileUsername}>{username}</Text>
              <Text style={styles.profileEmail}>{email}</Text>
            </View>
            <View style={styles.memberBadge}>
              <Text style={styles.memberBadgeText}>PRO</Text>
            </View>
          </View>

          {/* ── Account ── */}
          <SectionLabel label="ACCOUNT" />
          <View style={styles.card}>
            <ProfileEditSection
              name={name}
              email={email}
              username={username}
              onSave={(n, e, u) => {
                setName(n);
                setEmail(e);
                setUsername(u);
              }}
            />
            <Divider />
            <Row
              icon="credit-card"
              iconColor={COLORS.amber}
              iconBg={COLORS.amberMuted}
              label="Subscription"
              value="Pro Plan"
              onPress={() => {}}
            />
            <Divider />
            <Row
              icon="link"
              iconColor={COLORS.purple}
              iconBg={COLORS.purpleMuted}
              label="Linked Accounts"
              value="2 linked"
              onPress={() => {}}
            />
          </View>

          {/* ── Security ── */}
          <SectionLabel label="SECURITY" />
          <View style={styles.card}>
            <PasswordSection />
            <Divider />
            <Row
              icon="smartphone"
              iconColor={COLORS.green}
              iconBg={COLORS.greenMuted}
              label="Biometric Login"
              toggle
              toggleValue={biometrics}
              onToggle={setBiometrics}
            />
            <Divider />
            <Row
              icon="shield"
              iconColor={COLORS.purple}
              iconBg={COLORS.purpleMuted}
              label="Two-Factor Auth"
              value="Enabled"
              onPress={() => {}}
            />
            <Divider />
            <Row
              icon="clock"
              iconColor={COLORS.amber}
              iconBg={COLORS.amberMuted}
              label="Active Sessions"
              value="3 devices"
              onPress={() => {}}
            />
          </View>

          {/* ── Preferences ── */}
          <SectionLabel label="PREFERENCES" />
          <View style={styles.card}>
            <Row
              icon="bell"
              iconColor={COLORS.purple}
              iconBg={COLORS.purpleMuted}
              label="Notifications"
              toggle
              toggleValue={notifications}
              onToggle={setNotifications}
            />
            <Divider />
            <Row
              icon="moon"
              iconColor={COLORS.subtext}
              iconBg="rgba(255,255,255,0.06)"
              label="Dark Mode"
              toggle
              toggleValue={darkMode}
              onToggle={setDarkMode}
            />
            <Divider />
            <Row
              icon="dollar-sign"
              iconColor={COLORS.green}
              iconBg={COLORS.greenMuted}
              label="Currency"
              value="USD ($)"
              onPress={() => {}}
            />
            <Divider />
            <Row
              icon="calendar"
              iconColor={COLORS.amber}
              iconBg={COLORS.amberMuted}
              label="Budget Period"
              value="Monthly"
              onPress={() => {}}
            />
          </View>

          {/* ── Data ── */}
          <SectionLabel label="DATA" />
          <View style={styles.card}>
            <Row
              icon="download"
              iconColor={COLORS.purple}
              iconBg={COLORS.purpleMuted}
              label="Export Transactions"
              onPress={() => {}}
            />
            <Divider />
            <Row
              icon="upload"
              iconColor={COLORS.green}
              iconBg={COLORS.greenMuted}
              label="Import Data"
              onPress={() => {}}
            />
            <Divider />
            <Row
              icon="database"
              iconColor={COLORS.amber}
              iconBg={COLORS.amberMuted}
              label="Backup & Restore"
              onPress={() => {}}
            />
          </View>

          {/* ── Support ── */}
          <SectionLabel label="SUPPORT" />
          <View style={styles.card}>
            <Row
              icon="help-circle"
              iconColor={COLORS.subtext}
              iconBg="rgba(255,255,255,0.06)"
              label="Help Center"
              onPress={() => {}}
            />
            <Divider />
            <Row
              icon="message-square"
              iconColor={COLORS.purple}
              iconBg={COLORS.purpleMuted}
              label="Send Feedback"
              onPress={() => {}}
            />
            <Divider />
            <Row
              icon="star"
              iconColor={COLORS.amber}
              iconBg={COLORS.amberMuted}
              label="Rate the App"
              onPress={() => {}}
            />
          </View>

          {/* ── Danger zone ── */}
          <SectionLabel label="ACCOUNT ACTIONS" />
          <View style={styles.card}>
            <Row
              icon="log-out"
              iconColor={COLORS.red}
              iconBg={COLORS.redMuted}
              label="Sign Out"
              danger
              onPress={() => {}}
            />
            <Divider />
            <Row
              icon="trash-2"
              iconColor={COLORS.red}
              iconBg={COLORS.redMuted}
              label="Delete Account"
              danger
              onPress={() => {}}
            />
          </View>

          <Text style={styles.version}>BudgetTracker v1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </TabScreenWrapper>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 100 },

  pageTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
    marginTop: 16,
    marginBottom: 24,
  },

  // Profile card
  profileCard: {
    backgroundColor: COLORS.cardDeep,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: COLORS.purpleBorder,
    marginBottom: 28,
  },
  avatarCircle: {
    backgroundColor: "#5d4fe8",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: COLORS.white,
    fontWeight: "700",
  },
  profileInfo: { flex: 1 },
  profileName: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  profileUsername: {
    color: COLORS.purple,
    fontSize: 13,
    marginTop: 2,
  },
  profileEmail: {
    color: COLORS.subtext,
    fontSize: 12,
    marginTop: 2,
  },
  memberBadge: {
    backgroundColor: COLORS.purpleMuted,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.purpleBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  memberBadgeText: {
    color: COLORS.purple,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },

  // Section label
  sectionLabel: {
    color: COLORS.dim,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },

  // Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    overflow: "hidden",
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "500",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rowValue: {
    color: COLORS.subtext,
    fontSize: 13,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },

  // Password form (inline)
  passwordForm: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 14,
  },
  inputWrap: { gap: 6 },
  inputLabel: {
    color: COLORS.subtext,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111111",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border2,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
  },
  passwordActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border2,
    paddingVertical: 11,
    alignItems: "center",
  },
  cancelBtnText: {
    color: COLORS.subtext,
    fontSize: 14,
    fontWeight: "600",
  },
  saveBtn: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: COLORS.purple,
    paddingVertical: 11,
    alignItems: "center",
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },

  version: {
    color: COLORS.dim,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 8,
  },
});
