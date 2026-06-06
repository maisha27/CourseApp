import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCourseStore } from '../store/courseStore';

function OfflineIndicator() {
  const isOffline = useCourseStore(state => state.isOffline);
  const syncError = useCourseStore(state => state.syncError);

  if (!isOffline && !syncError) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {isOffline ? '📵 You are offline — showing cached data' : '⚠️ Sync failed — showing cached data'}
      </Text>
    </View>
  );
}

export default memo(OfflineIndicator);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f59e0b',
    padding: 8,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
