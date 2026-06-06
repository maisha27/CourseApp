import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useCourseStore } from '../store/courseStore';
import { toggleEnrollment } from '../repositories/courseRepository';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

export default function CourseDetailScreen({ route }: Props) {
  const course = route.params.course;
  const updateEnrollmentInStore = useCourseStore(state => state.updateEnrollmentInStore);

  // Local state gives instant UI feedback — no store round-trip delay
  const [isEnrolled, setIsEnrolled] = useState(course.is_enrolled);

  const formattedDate = new Date(course.last_updated).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const doToggle = (currentStatus: boolean) => {
    setIsEnrolled(!currentStatus);
    toggleEnrollment(course.course_id, currentStatus);
    updateEnrollmentInStore(course.course_id);
  };

  const handleEnrollment = () => {
    if (isEnrolled) {
      Alert.alert(
        'Remove Enrollment',
        'Remove this course from your enrolled list?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => doToggle(true) },
        ]
      );
    } else {
      doToggle(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {isEnrolled && (
        <View style={styles.enrolledBanner}>
          <Text style={styles.enrolledBannerText}>✓ You are enrolled in this course</Text>
        </View>
      )}

      <View style={styles.card}>
        {/* Title + type badge */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{course.title}</Text>
          <View style={[styles.typeBadge, course.is_premium ? styles.premiumBadge : styles.freeBadge]}>
            <Text style={[styles.typeBadgeText, course.is_premium ? styles.premiumText : styles.freeText]}>
              {course.is_premium ? 'Premium' : 'Free'}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{course.description_short}</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>⭐ {course.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{course.duration_weeks} wks</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {course.price_usd === 0 ? 'Free' : `$${course.price_usd}`}
            </Text>
            <Text style={styles.statLabel}>Price</Text>
          </View>
        </View>

        {/* Instructor */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>INSTRUCTOR</Text>
          <Text style={styles.sectionValue}>{course.instructor_name}</Text>
          {course.instructor_expertise_level && (
            <Text style={styles.sectionSub}>{course.instructor_expertise_level}</Text>
          )}
        </View>

        {/* Tags */}
        {course.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>TAGS</Text>
            <View style={styles.tags}>
              {course.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.updatedText}>Last updated {formattedDate}</Text>

        <TouchableOpacity
          style={[styles.enrollBtn, isEnrolled && styles.unenrollBtn]}
          onPress={handleEnrollment}
          activeOpacity={0.8}
        >
          <Text style={styles.enrollBtnText}>
            {isEnrolled ? 'Remove Enrollment' : 'Mark as Enrolled'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { paddingBottom: 32 },
  enrolledBanner: {
    backgroundColor: '#d1fae5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 10,
  },
  enrolledBannerText: { color: '#065f46', fontWeight: '700', fontSize: 13, textAlign: 'center' },
  card: {
    margin: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#111827', flex: 1, marginRight: 10, lineHeight: 28 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 3 },
  premiumBadge: { backgroundColor: '#fef3c7' },
  freeBadge: { backgroundColor: '#d1fae5' },
  typeBadgeText: { fontSize: 12, fontWeight: '700' },
  premiumText: { color: '#92400e' },
  freeText: { color: '#065f46' },
  description: { fontSize: 14, color: '#4b5563', lineHeight: 22, marginBottom: 20 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
  },
  stat: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: 32, backgroundColor: '#e5e7eb' },
  statValue: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 },
  section: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: '#9ca3af',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6,
  },
  sectionValue: { fontSize: 15, color: '#111827', fontWeight: '600' },
  sectionSub: { fontSize: 13, color: '#6b7280', marginTop: 3 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#ccfbf1', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  tagText: { fontSize: 12, color: '#0f766e', fontWeight: '500' },
  updatedText: { fontSize: 12, color: '#9ca3af', marginBottom: 20, textAlign: 'center' },
  enrollBtn: {
    backgroundColor: '#0d9488',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  unenrollBtn: { backgroundColor: '#ef4444' },
  enrollBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
});
