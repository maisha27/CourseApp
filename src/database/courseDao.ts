import { db } from './db';
import { Course, CourseFilters } from '../types/course';

export function saveCoursesToLocal(courses: Course[]) {
  for (const course of courses) {
    db.runSync(
      `INSERT OR REPLACE INTO courses
       (course_id, title, description_short, instructor_id, instructor_name,
        instructor_expertise_level, duration_weeks, price_usd, is_premium,
        tags, rating, last_updated, is_enrolled)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         COALESCE((SELECT is_enrolled FROM courses WHERE course_id = ?), 0)
       )`,
      [
        course.course_id, course.title, course.description_short,
        course.instructor_id, course.instructor_name,
        course.instructor_expertise_level, course.duration_weeks,
        course.price_usd, course.is_premium ? 1 : 0,
        JSON.stringify(course.tags), course.rating, course.last_updated,
        course.course_id,
      ]
    );
  }
}

// Pure function — converts a raw SQLite row to a typed Course object.
// Exported so it can be unit tested without a real database.
export function mapRowToCourse(row: any): Course {
  return {
    ...row,
    is_premium: row.is_premium === 1,
    is_enrolled: row.is_enrolled === 1,
    tags: JSON.parse(row.tags),
  };
}

// Pure function — builds the SQL query string and params array from filter options.
// Exported so it can be unit tested without a real database.
export function buildCourseQuery(filters: CourseFilters = {}): {
  sql: string;
  params: (string | number)[];
} {
  const { searchQuery, filterPremium, filterEnrolled, sortBy = 'rating' } = filters;

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (searchQuery?.trim()) {
    const q = `%${searchQuery.trim()}%`;
    conditions.push('(title LIKE ? OR instructor_name LIKE ? OR tags LIKE ?)');
    params.push(q, q, q);
  }

  if (filterPremium === 'free') conditions.push('is_premium = 0');
  else if (filterPremium === 'premium') conditions.push('is_premium = 1');

  if (filterEnrolled === 'enrolled') conditions.push('is_enrolled = 1');
  else if (filterEnrolled === 'not_enrolled') conditions.push('is_enrolled = 0');

  const orderByMap: Record<string, string> = {
    rating: 'rating DESC',
    price: 'price_usd ASC',
    duration: 'duration_weeks ASC',
  };
  const orderBy = orderByMap[sortBy] ?? 'rating DESC';
  const wherePart = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
  const sql = `SELECT * FROM courses${wherePart} ORDER BY ${orderBy}`;

  return { sql, params };
}

export function getCoursesFromLocal(filters: CourseFilters = {}): Course[] {
  const { sql, params } = buildCourseQuery(filters);
  const rows = db.getAllSync(sql, params) as any[];
  return rows.map(mapRowToCourse);
}

export function updateEnrollment(courseId: string, isEnrolled: boolean) {
  db.runSync(
    'UPDATE courses SET is_enrolled = ? WHERE course_id = ?',
    [isEnrolled ? 1 : 0, courseId]
  );
}
