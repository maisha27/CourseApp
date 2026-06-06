import { createClient } from '@supabase/supabase-js';
import { Course } from '../types/course';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    detectSessionInUrl: false,
    autoRefreshToken: false,
  },
});

function isValidCourse(raw: any): boolean {
  return (
    typeof raw.course_id === 'string' && raw.course_id.length > 0 &&
    typeof raw.title === 'string' && raw.title.length > 0 &&
    typeof raw.description_short === 'string' &&
    typeof raw.instructor_name === 'string' &&
    typeof raw.duration_weeks === 'number' &&
    typeof raw.price_usd === 'number' &&
    typeof raw.is_premium === 'boolean' &&
    Array.isArray(raw.tags) &&
    typeof raw.rating === 'number' &&
    typeof raw.last_updated === 'string'
  );
}

export async function fetchCoursesFromSupabase(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*');

  if (error) throw new Error(error.message);

  const records = data ?? [];
  const valid = records.filter(isValidCourse);

  if (valid.length < records.length) {
    console.warn(`[Supabase] ${records.length - valid.length} record(s) had unexpected shape and were skipped`);
  }

  return valid.map(course => ({
    ...course,
    is_enrolled: false,
  }));
}
