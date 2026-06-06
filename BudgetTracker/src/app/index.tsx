import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabScreenWrapper } from './_layout';

const DARK = { text: '#ffffff', subtext: '#aaaaaa', card: '#1e1e1e', income: '#2a2a3a', expense: '#2a1a1a' };

const BALANCE = 25;
const INCOME = 1231231;
const EXPENSES = 1231206;
const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

function BalanceBox({ label, amount, color }: { label: string; amount: number; color: string }) {
  return (
    <View style={[styles.balanceCardBox, { backgroundColor: color }]}>
      <Text style={styles.boxLabel}>{label}</Text>
      <Text style={styles.boxAmount}>{formatCurrency(amount)}</Text>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <TabScreenWrapper>
      <SafeAreaView style={styles.parent}>
        <Text style={styles.headerText}>Budget Tracker</Text>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceCardHeaderText}>
            Total Balance: {formatCurrency(BALANCE)}
          </Text>
          <View style={styles.balanceCardGroup}>
            <BalanceBox label="Income" amount={INCOME} color={DARK.income} />
            <BalanceBox label="Expenses" amount={EXPENSES} color={DARK.expense} />
          </View>
        </View>
      </SafeAreaView>
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  parent: { marginTop: 23, marginHorizontal: 20 },
  headerText: { fontSize: 25, fontWeight: 'bold', color: '#ffffff' },
  balanceCard: { marginTop: 50, borderRadius: 25, backgroundColor: '#1e1e1e', padding: 25 },
  balanceCardHeaderText: { fontSize: 15, fontWeight: 'bold', color: '#aaaaaa' },
  balanceCardGroup: { flexDirection: 'row', gap: 10, marginTop: 18 },
  balanceCardBox: { flex: 1, borderRadius: 15, padding: 15 },
  boxLabel: { fontSize: 20, fontWeight: 'bold', color: '#ffffff' },
  boxAmount: { fontSize: 14, marginTop: 2, color: '#aaaaaa' },
});