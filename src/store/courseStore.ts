import { create } from 'zustand';
import { Course } from '../types/course';

type CourseStore = {
  courses: Course[];
  searchQuery: string;
  filterPremium: 'all' | 'free' | 'premium';
  filterEnrolled: 'all' | 'enrolled' | 'not_enrolled';
  sortBy: 'rating' | 'price' | 'duration';
  isOffline: boolean;
  syncError: boolean;
  lastSynced: string | null;
  enrollmentVersion: number;
  setCourses: (courses: Course[]) => void;
  setSearchQuery: (query: string) => void;
  setFilterPremium: (filter: 'all' | 'free' | 'premium') => void;
  setFilterEnrolled: (filter: 'all' | 'enrolled' | 'not_enrolled') => void;
  setSortBy: (sort: 'rating' | 'price' | 'duration') => void;
  setIsOffline: (status: boolean) => void;
  setSyncError: (status: boolean) => void;
  setLastSynced: (time: string | null) => void;
  updateEnrollmentInStore: (courseId: string) => void;
};

export const useCourseStore = create<CourseStore>((set) => ({
  courses: [],
  searchQuery: '',
  filterPremium: 'all',
  filterEnrolled: 'all',
  sortBy: 'rating',
  isOffline: false,
  syncError: false,
  lastSynced: null,
  enrollmentVersion: 0,

  setCourses: (courses) => set({ courses }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterPremium: (filter) => set({ filterPremium: filter }),
  setFilterEnrolled: (filter) => set({ filterEnrolled: filter }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setIsOffline: (status) => set({ isOffline: status }),
  setSyncError: (status) => set({ syncError: status }),
  setLastSynced: (time) => set({ lastSynced: time }),

  updateEnrollmentInStore: (courseId) =>
    set((state) => ({
      enrollmentVersion: state.enrollmentVersion + 1,
      courses: state.courses.map((c) =>
        c.course_id === courseId ? { ...c, is_enrolled: !c.is_enrolled } : c
      ),
    })),
}));
