
import { create } from 'zustand';

interface CourseState {
  completedModules: string[];
  currentCourseId: string | null;
  enrollmentId: string | null;
  examStatus: 'not_started' | 'in_progress' | 'completed' | 'passed' | 'failed';
  totalModulesCount: number;
  
  setCompletedModules: (moduleIds: string[]) => void;
  setCurrentCourse: (courseId: string) => void;
  setEnrollmentId: (enrollmentId: string) => void;
  setExamStatus: (status: CourseState['examStatus']) => void;
  setTotalModulesCount: (count: number) => void;
  resetCourseState: () => void;
  getCourseProgress: () => number;
}

const initialState = {
  completedModules: [],
  currentCourseId: null,
  enrollmentId: null,
  examStatus: 'not_started' as const,
  totalModulesCount: 0,
};

export const useCourseStore = create<CourseState>((set, get) => ({
  ...initialState,

  setCompletedModules: (moduleIds) => {
    set({ completedModules: moduleIds });
  },

  setCurrentCourse: (courseId) => {
    set({ currentCourseId: courseId });
  },

  setEnrollmentId: (enrollmentId) => {
    set({ enrollmentId });
  },

  setExamStatus: (status) => {
    set({ examStatus: status });
  },

  setTotalModulesCount: (count) => {
    set({ totalModulesCount: count });
  },

  resetCourseState: () => {
    set(initialState);
  },

  getCourseProgress: () => {
    const { completedModules, totalModulesCount } = get();
    if (!totalModulesCount) return 0;
    return Math.round((completedModules.length / totalModulesCount) * 100);
  },
}));
