import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabScreenWrapper } from './_layout';
import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';

type TransactionType = 'income' | 'expense';

const COLORS = {
  bg: '#111111',
  card: '#1a1a1a',
  border: '#222222',
  white: '#ffffff',
  subtext: '#555555',
  green: '#50c88c',
  red: '#ff6464',
};

export default function CreateScreen() {
  const [type, setType] = useState<TransactionType>('income');
  const accent = type === 'income' ? COLORS.green : COLORS.red;

  return (
    <TabScreenWrapper>
      <SafeAreaView style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

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
              style={[styles.toggleBtn, type === 'income' && { backgroundColor: COLORS.green }]}
              onPress={() => setType('income')}
            >
              <Text style={[styles.toggleText, type === 'income' && { color: COLORS.white }]}>
                Income
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, type === 'expense' && { backgroundColor: COLORS.red }]}
              onPress={() => setType('expense')}
            >
              <Text style={[styles.toggleText, type === 'expense' && { color: COLORS.white }]}>
                Expense
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount Display — placeholder */}
          <View style={styles.amountPlaceholder}>
            <Text style={styles.amountLabel}>AMOUNT</Text>
            <Text style={styles.amountValue}>$0.00</Text>
          </View>

          {/* Category Picker — placeholder */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CATEGORY</Text>
            <View style={styles.categoryPlaceholder}>
              <Text style={styles.placeholderText}>Category chips go here</Text>
            </View>
          </View>

          {/* Details — placeholder */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DETAILS</Text>
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Feather name="edit-2" size={18} color="#444" />
                  <Text style={styles.detailLabel}>Description</Text>
                </View>
                <Text style={styles.detailValue}>Add note...</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Feather name="calendar" size={18} color="#444" />
                  <Text style={styles.detailLabel}>Date</Text>
                </View>
                <Text style={styles.detailValue}>Today</Text>
              </View>
            </View>
          </View>

          {/* Submit Button — placeholder */}
          <TouchableOpacity style={styles.submitBtn}>
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

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, marginBottom: 28 },
  title: { color: COLORS.white, fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  closeBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: COLORS.card, borderWidth: 1, borderColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' },

  toggle: { backgroundColor: COLORS.card, borderRadius: 16, padding: 6, flexDirection: 'row', gap: 4, borderWidth: 1, borderColor: COLORS.border, marginBottom: 32 },
  toggleBtn: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center' },
  toggleText: { fontSize: 14, fontWeight: '700', color: COLORS.subtext },

  togglePlaceholder: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', marginBottom: 32 },
  amountPlaceholder: { alignItems: 'center', paddingVertical: 20, marginBottom: 24 },
  amountLabel: { color: COLORS.subtext, fontSize: 12, letterSpacing: 0.8, marginBottom: 8 },
  amountValue: { color: COLORS.white, fontSize: 52, fontWeight: '700', letterSpacing: -2 },

  section: { marginBottom: 24 },
  sectionLabel: { color: COLORS.subtext, fontSize: 12, letterSpacing: 0.8, marginBottom: 10, marginLeft: 4 },
  categoryPlaceholder: { backgroundColor: COLORS.card, borderRadius: 14, padding: 20, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  placeholderText: { color: '#333', fontSize: 13 },

  detailsCard: { backgroundColor: COLORS.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border, gap: 14 },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailLabel: { color: COLORS.subtext, fontSize: 14 },
  detailValue: { color: '#333', fontSize: 14 },
  divider: { height: 1, backgroundColor: COLORS.border },

  submitBtn: { backgroundColor: COLORS.green, borderRadius: 16, padding: 18, alignItems: 'center', marginTop: 8 },
  submitText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});