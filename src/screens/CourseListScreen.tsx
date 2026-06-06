import { useEffect, useCallback, useState } from 'react';
import { View, FlatList, Text, RefreshControl, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';
import { useCourseStore } from '../store/courseStore';
import { getLocalCourses, syncFromSupabase } from '../repositories/courseRepository';
import { checkIsOffline } from '../utils/networkUtils';
import { Course } from '../types/course';
import { RootStackParamList } from '../../App';
import CourseCard from '../components/CourseCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import OfflineIndicator from '../components/OfflineIndicator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CourseList'>;

export default function CourseListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    courses, setCourses,
    searchQuery, filterPremium, filterEnrolled, sortBy, enrollmentVersion,
    syncError, setSyncError, setIsOffline, setLastSynced, lastSynced,
  } = useCourseStore(
    useShallow(state => ({
      courses: state.courses,
      setCourses: state.setCourses,
      searchQuery: state.searchQuery,
      filterPremium: state.filterPremium,
      filterEnrolled: state.filterEnrolled,
      sortBy: state.sortBy,
      enrollmentVersion: state.enrollmentVersion,
      syncError: state.syncError,
      setSyncError: state.setSyncError,
      setIsOffline: state.setIsOffline,
      setLastSynced: state.setLastSynced,
      lastSynced: state.lastSynced,
    }))
  );

  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const renderItem = useCallback(({ item }: { item: Course }) => (
    <CourseCard
      course={item}
      onPress={() => navigation.navigate('CourseDetail', { course: item })}
    />
  ), [navigation]);

  // Re-query SQLite whenever search, filter, sort, or enrollment changes.
  // This is the core of the "filtering at the data layer" pattern.
  useEffect(() => {
    const results = getLocalCourses({ searchQuery, filterPremium, filterEnrolled, sortBy });
    setCourses(results);
  }, [searchQuery, filterPremium, filterEnrolled, sortBy, enrollmentVersion]);

  const runSync = useCallback(async () => {
    setIsSyncing(true);
    const offline = await checkIsOffline();
    setIsOffline(offline);

    const { syncError } = await syncFromSupabase();
    setSyncError(syncError);
    setIsSyncing(false);

    if (!syncError) {
      setLastSynced(new Date().toLocaleTimeString());
      // After sync, re-query with current filter state so fresh data is shown
      const { searchQuery: q, filterPremium: fp, filterEnrolled: fe, sortBy: sb } =
        useCourseStore.getState();
      setCourses(getLocalCourses({ searchQuery: q, filterPremium: fp, filterEnrolled: fe, sortBy: sb }));
    }
  }, []);

  useEffect(() => {
    // Step 1: show cached data instantly
    const cached = getLocalCourses();
    setCourses(cached);
    setLoading(false);

    // Step 2: sync from Supabase in background
    runSync();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const offline = await checkIsOffline();
    setIsOffline(offline);

    const { syncError } = await syncFromSupabase();
    setSyncError(syncError);

    if (!syncError) {
      setLastSynced(new Date().toLocaleTimeString());
      const { searchQuery: q, filterPremium: fp, filterEnrolled: fe, sortBy: sb } =
        useCourseStore.getState();
      setCourses(getLocalCourses({ searchQuery: q, filterPremium: fp, filterEnrolled: fe, sortBy: sb }));
    }
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0d9488" />
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OfflineIndicator />
      <SearchBar />
      <FilterBar />
      <View style={styles.statusRow}>
        <Text style={styles.courseCount}>
          {courses.length} {courses.length === 1 ? 'course' : 'courses'}
        </Text>
        {isSyncing ? (
          <View style={styles.syncingRow}>
            <ActivityIndicator size="small" color="#0d9488" />
            <Text style={styles.syncingText}>Syncing...</Text>
          </View>
        ) : (
          lastSynced && <Text style={styles.syncText}>Synced {lastSynced}</Text>
        )}
      </View>
      <FlatList
        style={styles.list}
        data={courses}
        keyExtractor={item => item.course_id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0d9488" />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {isSyncing ? (
              <>
                <ActivityIndicator size="large" color="#0d9488" />
                <Text style={styles.emptyText}>Loading courses...</Text>
              </>
            ) : syncError ? (
              <>
                <Text style={styles.errorTitle}>Could not load courses</Text>
                <Text style={styles.errorSubtext}>Check your connection and try again.</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={onRefresh}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.emptyText}>No courses found</Text>
            )}
          </View>
        }
        contentContainerStyle={courses.length === 0 ? styles.emptyFlex : { paddingBottom: insets.bottom + 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#6b7280', fontSize: 14 },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    minHeight: 28,
  },
  courseCount: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  syncingRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  syncingText: { fontSize: 11, color: '#0d9488' },
  syncText: { fontSize: 11, color: '#9ca3af' },
  emptyContainer: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyText: { fontSize: 15, color: '#6b7280', marginTop: 12 },
  errorTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 8 },
  errorSubtext: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  retryBtn: {
    backgroundColor: '#0d9488', paddingHorizontal: 28,
    paddingVertical: 12, borderRadius: 10,
  },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  list: { flex: 1 },
  emptyFlex: { flex: 1 },
});
