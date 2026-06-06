// Mock expo-sqlite so the module can be imported without a real device.
// mapRowToCourse is a pure function — it never calls the DB — but it lives
// in the same file as the DB import, so we must mock the module first.
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: jest.fn(),
    runSync: jest.fn(),
    getAllSync: jest.fn(() => []),
  })),
}));

import { mapRowToCourse } from '../src/database/courseDao';

const baseRow = {
  course_id: 'C-001',
  title: 'React Native Basics',
  description_short: 'A beginner course.',
  instructor_id: 'I-001',
  instructor_name: 'Prof. Anika',
  instructor_expertise_level: 'Senior',
  duration_weeks: 6,
  price_usd: 29.99,
  is_premium: 0,
  is_enrolled: 0,
  tags: '["react","mobile"]',
  rating: 4.5,
  last_updated: '2026-01-01T00:00:00Z',
};

describe('mapRowToCourse', () => {
  it('converts is_premium integer 1 to boolean true', () => {
    const course = mapRowToCourse({ ...baseRow, is_premium: 1 });
    expect(course.is_premium).toBe(true);
  });

  it('converts is_premium integer 0 to boolean false', () => {
    const course = mapRowToCourse({ ...baseRow, is_premium: 0 });
    expect(course.is_premium).toBe(false);
  });

  it('converts is_enrolled integer 1 to boolean true', () => {
    const course = mapRowToCourse({ ...baseRow, is_enrolled: 1 });
    expect(course.is_enrolled).toBe(true);
  });

  it('converts is_enrolled integer 0 to boolean false', () => {
    const course = mapRowToCourse({ ...baseRow, is_enrolled: 0 });
    expect(course.is_enrolled).toBe(false);
  });

  it('parses tags from a JSON string into a string array', () => {
    const course = mapRowToCourse({ ...baseRow, tags: '["react","mobile","typescript"]' });
    expect(course.tags).toEqual(['react', 'mobile', 'typescript']);
  });

  it('parses an empty tags JSON string into an empty array', () => {
    const course = mapRowToCourse({ ...baseRow, tags: '[]' });
    expect(course.tags).toEqual([]);
  });

  it('preserves all other fields unchanged', () => {
    const course = mapRowToCourse(baseRow);
    expect(course.course_id).toBe('C-001');
    expect(course.title).toBe('React Native Basics');
    expect(course.rating).toBe(4.5);
    expect(course.price_usd).toBe(29.99);
    expect(course.duration_weeks).toBe(6);
  });
});
