import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Lesson } from '../data/courses';
import { useAuth } from './AuthContext';
import * as courseAPI from '../api/courses';

interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  lastAccessedLessonId: string | null;
  quizScores: Record<string, number>;
}

interface CourseContextProps {
  courses: Course[];
  enrolledCourses: Course[];
  instructorCourses: Course[];
  courseProgress: Record<string, CourseProgress>;
  getCourse: (id: string) => Course | undefined;
  enrollInCourse: (courseId: string) => Promise<boolean>;
  unenrollFromCourse: (courseId: string) => Promise<boolean>;
  createCourse: (course: Omit<Course, 'id' | 'instructor' | 'instructorName' | 'enrolledStudents' | 'createdAt' | 'updatedAt'>) => Promise<Course>;
  updateCourse: (courseId: string, courseData: Partial<Course>) => Promise<boolean>;
  deleteCourse: (courseId: string) => Promise<boolean>;
  addLesson: (courseId: string, lesson: Omit<Lesson, 'id'>) => Promise<boolean>;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  getProgress: (courseId: string) => number;
}

const CourseContext = createContext<CourseContextProps>({
  courses: [],
  enrolledCourses: [],
  instructorCourses: [],
  courseProgress: {},
  getCourse: () => undefined,
  enrollInCourse: async () => Promise.resolve(false),
  unenrollFromCourse: async () => Promise.resolve(false),
  createCourse: async () => Promise.resolve({} as Course),
  updateCourse: async () => Promise.resolve(false),
  deleteCourse: async () => Promise.resolve(false),
  addLesson: async () => Promise.resolve(false),
  markLessonComplete: () => {},
  getProgress: () => 0,
});

export const useCourses = () => useContext(CourseContext);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const coursesData = await courseAPI.getAllCourses();
      setCourses(coursesData);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };
  const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgress>>({});

  // Filter courses for the current user
  const enrolledCourses = user 
    ? courses.filter(course => course.enrolledStudents.includes(user.id))
    : [];

  const instructorCourses = user?.role === 'instructor'
    ? courses.filter(course => course.instructor === user.id)
    : [];

  const getCourse = (id: string): Course | undefined => {
    return courses.find(course => course.id === id);
  };

  const enrollInCourse = async (courseId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      await courseAPI.enrollInCourse(courseId);
      await loadCourses(); // Reload courses to get updated enrollment status
      
      // Initialize course progress
      setCourseProgress(prev => ({
        ...prev,
        [courseId]: {
          courseId,
          completedLessons: [],
          lastAccessedLessonId: null,
          quizScores: {},
        },
      }));

      return true;
    } catch (error) {
      console.error('Failed to enroll in course:', error);
      return false;
    }
  };

  const unenrollFromCourse = async (courseId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      await courseAPI.unenrollFromCourse(courseId);
      await loadCourses(); // Reload courses to get updated enrollment status
      return true;
    } catch (error) {
      console.error('Failed to unenroll from course:', error);
      return false;
    }
  };

  const createCourse = async (courseData: Omit<Course, 'id' | 'instructor' | 'instructorName' | 'enrolledStudents' | 'createdAt' | 'updatedAt'>): Promise<Course> => {
    if (!user || user.role !== 'instructor') {
      throw new Error('Only instructors can create courses');
    }

    try {
      const newCourse = await courseAPI.createCourse(courseData);
      await loadCourses(); // Reload courses to include the new course
      return newCourse;
    } catch (error) {
      console.error('Failed to create course:', error);
      throw error;
    }
  };

  const updateCourse = async (courseId: string, courseData: Partial<Course>): Promise<boolean> => {
    if (!user || user.role !== 'instructor') return false;

    try {
      await courseAPI.updateCourse(courseId, courseData);
      await loadCourses(); // Reload courses to get updated course data
      return true;
    } catch (error) {
      console.error('Failed to update course:', error);
      return false;
    }
  };

  const deleteCourse = async (courseId: string): Promise<boolean> => {
    if (!user || user.role !== 'instructor') return false;

    try {
      await courseAPI.deleteCourse(courseId);
      await loadCourses(); // Reload courses to remove the deleted course
      return true;
    } catch (error) {
      console.error('Failed to delete course:', error);
      return false;
    }
  };

  const addLesson = async (courseId: string, lessonData: Omit<Lesson, 'id'>): Promise<boolean> => {
    if (!user || user.role !== 'instructor') return false;

    try {
      await courseAPI.addLesson(courseId, lessonData);
      await loadCourses(); // Reload courses to include the new lesson
      return true;
    } catch (error) {
      console.error('Failed to add lesson:', error);
      return false;
    }
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    if (!user) return;

    setCourseProgress(prev => {
      const progress = prev[courseId] || {
        courseId,
        completedLessons: [],
        lastAccessedLessonId: null,
        quizScores: {},
      };

      if (!progress.completedLessons.includes(lessonId)) {
        return {
          ...prev,
          [courseId]: {
            ...progress,
            completedLessons: [...progress.completedLessons, lessonId],
            lastAccessedLessonId: lessonId,
          },
        };
      }

      return prev;
    });
  };

  const getProgress = (courseId: string): number => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;

    const progress = courseProgress[courseId];
    if (!progress) return 0;

    const totalLessons = course.lessons.length;
    if (totalLessons === 0) return 0;

    const completedLessons = progress.completedLessons.length;
    return (completedLessons / totalLessons) * 100;
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        enrolledCourses,
        instructorCourses,
        courseProgress,
        getCourse,
        enrollInCourse,
        unenrollFromCourse,
        createCourse,
        updateCourse,
        deleteCourse,
        addLesson,
        markLessonComplete,
        getProgress,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};