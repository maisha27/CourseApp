jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: jest.fn(),
    runSync: jest.fn(),
    getAllSync: jest.fn(() => []),
  })),
}));

import { buildCourseQuery } from '../src/database/courseDao';

describe('buildCourseQuery', () => {
  describe('no filters', () => {
    it('returns all courses sorted by rating descending by default', () => {
      const { sql, params } = buildCourseQuery({});
      expect(sql).toBe('SELECT * FROM courses ORDER BY rating DESC');
      expect(params).toEqual([]);
    });
  });

  describe('search', () => {
    it('adds a WHERE clause with LIKE conditions for title, instructor, and tags', () => {
      const { sql, params } = buildCourseQuery({ searchQuery: 'react' });
      expect(sql).toContain('WHERE');
      expect(sql).toContain('title LIKE ?');
      expect(sql).toContain('instructor_name LIKE ?');
      expect(sql).toContain('tags LIKE ?');
      expect(params).toEqual(['%react%', '%react%', '%react%']);
    });

    it('trims whitespace from the search query', () => {
      const { params } = buildCourseQuery({ searchQuery: '  react  ' });
      expect(params).toEqual(['%react%', '%react%', '%react%']);
    });

    it('ignores an empty search query', () => {
      const { sql, params } = buildCourseQuery({ searchQuery: '' });
      expect(sql).not.toContain('WHERE');
      expect(params).toEqual([]);
    });
  });

  describe('premium filter', () => {
    it('adds is_premium = 1 when filterPremium is "premium"', () => {
      const { sql } = buildCourseQuery({ filterPremium: 'premium' });
      expect(sql).toContain('is_premium = 1');
    });

    it('adds is_premium = 0 when filterPremium is "free"', () => {
      const { sql } = buildCourseQuery({ filterPremium: 'free' });
      expect(sql).toContain('is_premium = 0');
    });

    it('adds no premium condition when filterPremium is "all"', () => {
      const { sql } = buildCourseQuery({ filterPremium: 'all' });
      expect(sql).not.toContain('is_premium');
    });
  });

  describe('enrolled filter', () => {
    it('adds is_enrolled = 1 when filterEnrolled is "enrolled"', () => {
      const { sql } = buildCourseQuery({ filterEnrolled: 'enrolled' });
      expect(sql).toContain('is_enrolled = 1');
    });

    it('adds is_enrolled = 0 when filterEnrolled is "not_enrolled"', () => {
      const { sql } = buildCourseQuery({ filterEnrolled: 'not_enrolled' });
      expect(sql).toContain('is_enrolled = 0');
    });

    it('adds no enrolled condition when filterEnrolled is "all"', () => {
      const { sql } = buildCourseQuery({ filterEnrolled: 'all' });
      expect(sql).not.toContain('is_enrolled');
    });
  });

  describe('sorting', () => {
    it('sorts by price_usd ascending when sortBy is "price"', () => {
      const { sql } = buildCourseQuery({ sortBy: 'price' });
      expect(sql).toContain('ORDER BY price_usd ASC');
    });

    it('sorts by duration_weeks ascending when sortBy is "duration"', () => {
      const { sql } = buildCourseQuery({ sortBy: 'duration' });
      expect(sql).toContain('ORDER BY duration_weeks ASC');
    });

    it('sorts by rating descending when sortBy is "rating"', () => {
      const { sql } = buildCourseQuery({ sortBy: 'rating' });
      expect(sql).toContain('ORDER BY rating DESC');
    });
  });

  describe('combined filters', () => {
    it('combines search, premium filter, and sort correctly', () => {
      const { sql, params } = buildCourseQuery({
        searchQuery: 'python',
        filterPremium: 'free',
        sortBy: 'price',
      });
      expect(sql).toContain('title LIKE ?');
      expect(sql).toContain('is_premium = 0');
      expect(sql).toContain('ORDER BY price_usd ASC');
      expect(params).toContain('%python%');
    });

    it('combines enrolled filter and sort without a search query', () => {
      const { sql, params } = buildCourseQuery({
        filterEnrolled: 'enrolled',
        sortBy: 'duration',
      });
      expect(sql).toContain('is_enrolled = 1');
      expect(sql).toContain('ORDER BY duration_weeks ASC');
      expect(params).toEqual([]);
    });
  });
});
