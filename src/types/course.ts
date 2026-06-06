export type Course = {
  course_id: string;
  title: string;
  description_short: string;
  instructor_id: string | null;
  instructor_name: string;
  instructor_expertise_level: string | null;
  duration_weeks: number;
  price_usd: number;
  is_premium: boolean;
  tags: string[];
  rating: number;
  last_updated: string;
  is_enrolled: boolean; // this is local only, never comes from Supabase
};

export type CourseFilters = {
  searchQuery?: string;
  filterPremium?: 'all' | 'free' | 'premium';
  filterEnrolled?: 'all' | 'enrolled' | 'not_enrolled';
  sortBy?: 'rating' | 'price' | 'duration';
};
