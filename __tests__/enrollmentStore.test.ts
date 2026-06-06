import { useCourseStore } from '../src/store/courseStore';
import { Course } from '../src/types/course';

const makeCourse = (id: string, enrolled: boolean): Course => ({
  course_id: id,
  title: `Course ${id}`,
  description_short: 'Test description',
  instructor_id: null,
  instructor_name: 'Test Instructor',
  instructor_expertise_level: null,
  duration_weeks: 4,
  price_usd: 0,
  is_premium: false,
  tags: [],
  rating: 4.0,
  last_updated: '2026-01-01T00:00:00Z',
  is_enrolled: enrolled,
});

describe('updateEnrollmentInStore', () => {
  beforeEach(() => {
    // Reset the store to a known state before each test
    useCourseStore.setState({
      courses: [makeCourse('C-001', false), makeCourse('C-002', true)],
      enrollmentVersion: 0,
    });
  });

  it('toggles is_enrolled from false to true', () => {
    useCourseStore.getState().updateEnrollmentInStore('C-001');
    const course = useCourseStore.getState().courses.find(c => c.course_id === 'C-001');
    expect(course?.is_enrolled).toBe(true);
  });

  it('toggles is_enrolled from true to false', () => {
    useCourseStore.getState().updateEnrollmentInStore('C-002');
    const course = useCourseStore.getState().courses.find(c => c.course_id === 'C-002');
    expect(course?.is_enrolled).toBe(false);
  });

  it('increments enrollmentVersion by 1 on each toggle', () => {
    useCourseStore.getState().updateEnrollmentInStore('C-001');
    expect(useCourseStore.getState().enrollmentVersion).toBe(1);

    useCourseStore.getState().updateEnrollmentInStore('C-001');
    expect(useCourseStore.getState().enrollmentVersion).toBe(2);
  });

  it('does not affect the enrollment status of other courses', () => {
    useCourseStore.getState().updateEnrollmentInStore('C-001');
    const unaffected = useCourseStore.getState().courses.find(c => c.course_id === 'C-002');
    expect(unaffected?.is_enrolled).toBe(true);
  });

  it('does not change the total number of courses in the store', () => {
    useCourseStore.getState().updateEnrollmentInStore('C-001');
    expect(useCourseStore.getState().courses).toHaveLength(2);
  });
});
