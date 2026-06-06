import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabScreenWrapper } from './_layout';

export default function MoreScreen() {
  return (
    <TabScreenWrapper>
      <SafeAreaView style={styles.parent}>
        <Text style={styles.headerText}>More</Text>
      </SafeAreaView>
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  parent: { marginTop: 23, marginHorizontal: 20 },
  headerText: { fontSize: 25, fontWeight: 'bold', color: '#ffffff' },
});