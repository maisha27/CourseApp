import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Course } from '../types/course';

type Props = {
  course: Course;
  onPress: () => void;
};

const CourseCard = React.memo(({ course, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.card, course.is_premium ? styles.premiumAccent : styles.freeAccent]}
      onPress={onPress}
      activeOpacity={0.72}
    >
      {/* Row 1: Title + type badge */}
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
        <View style={[styles.typeBadge, course.is_premium ? styles.premiumBadge : styles.freeBadge]}>
          <Text style={[styles.typeBadgeText, course.is_premium ? styles.premiumText : styles.freeText]}>
            {course.is_premium ? 'Premium' : 'Free'}
          </Text>
        </View>
      </View>

      {/* Row 2: Instructor + enrolled badge */}
      <View style={styles.metaRow}>
        <Text style={styles.instructor} numberOfLines={1}>{course.instructor_name}</Text>
        {course.is_enrolled && (
          <View style={styles.enrolledBadge}>
            <Text style={styles.enrolledText}>✓ Enrolled</Text>
          </View>
        )}
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>{course.description_short}</Text>

      {/* Stats: rating · duration · price */}
      <View style={styles.statsRow}>
        <Text style={styles.stat}>⭐ {course.rating}</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.stat}>{course.duration_weeks} weeks</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.stat}>
          {course.price_usd === 0 ? 'Free' : `$${course.price_usd}`}
        </Text>
      </View>

      {/* Tags */}
      {course.tags.length > 0 && (
        <View style={styles.tags}>
          {course.tags.slice(0, 3).map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
});

export default CourseCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 14,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 3,
  },
  premiumAccent: { borderLeftColor: '#f59e0b' },
  freeAccent: { borderLeftColor: '#d1d5db' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 10,
    lineHeight: 22,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 2,
  },
  premiumBadge: { backgroundColor: '#fef3c7' },
  freeBadge: { backgroundColor: '#d1fae5' },
  typeBadgeText: { fontSize: 11, fontWeight: '700' },
  premiumText: { color: '#92400e' },
  freeText: { color: '#065f46' },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructor: { fontSize: 13, color: '#6b7280', flex: 1, marginRight: 8 },
  enrolledBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  enrolledText: { fontSize: 11, fontWeight: '700', color: '#065f46' },
  description: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 19,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stat: { fontSize: 12, color: '#6b7280' },
  dot: { fontSize: 12, color: '#d1d5db', marginHorizontal: 6 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: '#ccfbf1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: { fontSize: 11, color: '#0f766e', fontWeight: '500' },
});
