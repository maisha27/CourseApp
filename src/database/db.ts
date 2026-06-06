import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('courseapp.db');

export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS courses (
      course_id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description_short TEXT NOT NULL,
      instructor_id TEXT,
      instructor_name TEXT NOT NULL,
      instructor_expertise_level TEXT,
      duration_weeks INTEGER NOT NULL,
      price_usd REAL NOT NULL,
      is_premium INTEGER NOT NULL,
      tags TEXT NOT NULL,
      rating REAL NOT NULL,
      last_updated TEXT NOT NULL,
      is_enrolled INTEGER NOT NULL DEFAULT 0
    );
  `);
}
