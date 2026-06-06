import { fetchCoursesFromSupabase } from '../services/supabaseService';
import { saveCoursesToLocal, getCoursesFromLocal, updateEnrollment } from '../database/courseDao';
import { Course, CourseFilters } from '../types/course';

export function getLocalCourses(filters: CourseFilters = {}): Course[] {
  return getCoursesFromLocal(filters);
}

export async function syncFromSupabase(): Promise<{ syncError: boolean }> {
  try {
    const remoteCourses = await fetchCoursesFromSupabase();
    saveCoursesToLocal(remoteCourses);
    return { syncError: false };
  } catch (e) {
    console.error('[Supabase] Sync failed:', e);
    return { syncError: true };
  }
}

export function toggleEnrollment(courseId: string, currentStatus: boolean) {
  updateEnrollment(courseId, !currentStatus);
}
