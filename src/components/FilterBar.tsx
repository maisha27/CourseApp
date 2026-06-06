import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useCourseStore } from '../store/courseStore';

function FilterBar() {
  const { filterPremium, filterEnrolled, sortBy, setFilterPremium, setFilterEnrolled, setSortBy } =
    useCourseStore(
      useShallow(state => ({
        filterPremium: state.filterPremium,
        filterEnrolled: state.filterEnrolled,
        sortBy: state.sortBy,
        setFilterPremium: state.setFilterPremium,
        setFilterEnrolled: state.setFilterEnrolled,
        setSortBy: state.setSortBy,
      }))
    );

  const chip = (label: string, active: boolean, onPress: () => void) => (
    <TouchableOpacity
      key={label}
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>TYPE</Text>
        <View style={styles.chips}>
          {chip('All', filterPremium === 'all', () => setFilterPremium('all'))}
          {chip('Free', filterPremium === 'free', () => setFilterPremium('free'))}
          {chip('Premium', filterPremium === 'premium', () => setFilterPremium('premium'))}
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>STATUS</Text>
        <View style={styles.chips}>
          {chip('All', filterEnrolled === 'all', () => setFilterEnrolled('all'))}
          {chip('Enrolled', filterEnrolled === 'enrolled', () => setFilterEnrolled('enrolled'))}
          {chip('Not Enrolled', filterEnrolled === 'not_enrolled', () => setFilterEnrolled('not_enrolled'))}
        </View>
      </View>
      <View style={[styles.row, styles.lastRow]}>
        <Text style={styles.rowLabel}>SORT</Text>
        <View style={styles.chips}>
          {chip('Top Rated', sortBy === 'rating', () => setSortBy('rating'))}
          {chip('Price', sortBy === 'price', () => setSortBy('price'))}
          {chip('Duration', sortBy === 'duration', () => setSortBy('duration'))}
        </View>
      </View>
    </View>
  );
}

export default memo(FilterBar);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  lastRow: {
    marginBottom: 0,
  },
  rowLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 0.8,
    width: 52,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  chipActive: {
    backgroundColor: '#0d9488',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
  },
  chipTextActive: {
    color: '#fff',
  },
});
