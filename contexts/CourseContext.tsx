import React, { createContext, useContext, useState } from 'react';
import MOCK_COURSES, { Course, Lesson } from '../data/courses';
import { useAuth } from './AuthContext';
import * as Notifications from 'expo-notifications';

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
  enrollInCourse: (courseId: string) => boolean;
  unenrollFromCourse: (courseId: string) => boolean;
  createCourse: (
    course: Omit<
      Course,
      | 'id'
      | 'instructor'
      | 'instructorName'
      | 'enrolledStudents'
      | 'createdAt'
      | 'updatedAt'
    >
  ) => Course;
  updateCourse: (courseId: string, courseData: Partial<Course>) => boolean;
  deleteCourse: (courseId: string) => boolean;
  addLesson: (courseId: string, lesson: Omit<Lesson, 'id'>) => boolean;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  getProgress: (courseId: string) => number;
}

const CourseContext = createContext<CourseContextProps>({
  courses: [],
  enrolledCourses: [],
  instructorCourses: [],
  courseProgress: {},
  getCourse: () => undefined,
  enrollInCourse: () => false,
  unenrollFromCourse: () => false,
  createCourse: () => ({} as Course),
  updateCourse: () => false,
  deleteCourse: () => false,
  addLesson: () => false,
  markLessonComplete: () => {},
  getProgress: () => 0,
});

export const useCourses = () => useContext(CourseContext);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, updateUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [courseProgress, setCourseProgress] = useState<
    Record<string, CourseProgress>
  >({});

  // Filter courses for the current user
  const enrolledCourses = user
    ? courses.filter((course) => course.enrolledStudents.includes(user.id))
    : [];

  const instructorCourses =
    user?.role === 'instructor'
      ? courses.filter((course) => course.instructor === user.id)
      : [];

  const getCourse = (id: string): Course | undefined => {
    return courses.find((course) => course.id === id);
  };

  const enrollInCourse = async (courseId: string): Promise<boolean> => {
    if (!user) return false;

    const courseIndex = courses.findIndex((c) => c.id === courseId);
    if (courseIndex === -1) return false;

    // Check if already enrolled
    if (courses[courseIndex].enrolledStudents.includes(user.id)) {
      return true;
    }

    // Update the course's enrolled students
    const updatedCourses = [...courses];
    updatedCourses[courseIndex] = {
      ...updatedCourses[courseIndex],
      enrolledStudents: [
        ...updatedCourses[courseIndex].enrolledStudents,
        user.id,
      ],
    };
    setCourses(updatedCourses);

    // Update user's enrolled courses
    if (user && !user.enrolledCourses.includes(courseId)) {
      updateUser({
        enrolledCourses: [...user.enrolledCourses, courseId],
      });
    }

    // Initialize course progress
    setCourseProgress((prev) => ({
      ...prev,
      [courseId]: {
        courseId,
        completedLessons: [],
        lastAccessedLessonId: null,
        quizScores: {},
      },
    }));

    // Send push notification
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Course Enrollment Successful!',
          body: `You have successfully enrolled in ${updatedCourses[courseIndex].title}. Start learning now!`,
          data: { courseId },
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Error sending push notification:', error);
    }

    return true;
  };

  const unenrollFromCourse = (courseId: string): boolean => {
    if (!user) return false;

    const courseIndex = courses.findIndex((c) => c.id === courseId);
    if (courseIndex === -1) return false;

    // Update the course's enrolled students
    const updatedCourses = [...courses];
    updatedCourses[courseIndex] = {
      ...updatedCourses[courseIndex],
      enrolledStudents: updatedCourses[courseIndex].enrolledStudents.filter(
        (id) => id !== user.id
      ),
    };
    setCourses(updatedCourses);

    // Update user's enrolled courses
    if (user) {
      updateUser({
        enrolledCourses: user.enrolledCourses.filter((id) => id !== courseId),
      });
    }

    return true;
  };

  const createCourse = (
    courseData: Omit<
      Course,
      | 'id'
      | 'instructor'
      | 'instructorName'
      | 'enrolledStudents'
      | 'createdAt'
      | 'updatedAt'
    >
  ): Course => {
    if (!user || user.role !== 'instructor') {
      throw new Error('Only instructors can create courses');
    }

    const newCourse: Course = {
      ...courseData,
      id: `course${courses.length + 1}`,
      instructor: user.id,
      instructorName: user.name,
      enrolledStudents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCourses((prev) => [...prev, newCourse]);

    // Update instructor's created courses
    if (user.createdCourses) {
      updateUser({
        createdCourses: [...user.createdCourses, newCourse.id],
      });
    } else {
      updateUser({
        createdCourses: [newCourse.id],
      });
    }

    return newCourse;
  };

  const updateCourse = (
    courseId: string,
    courseData: Partial<Course>
  ): boolean => {
    if (!user || user.role !== 'instructor') return false;

    const courseIndex = courses.findIndex((c) => c.id === courseId);
    if (courseIndex === -1) return false;

    // Verify the user is the course instructor
    if (courses[courseIndex].instructor !== user.id) return false;

    const updatedCourses = [...courses];
    updatedCourses[courseIndex] = {
      ...updatedCourses[courseIndex],
      ...courseData,
      updatedAt: new Date(),
    };
    setCourses(updatedCourses);

    return true;
  };

  const deleteCourse = (courseId: string): boolean => {
    if (!user || user.role !== 'instructor') return false;

    const courseIndex = courses.findIndex((c) => c.id === courseId);
    if (courseIndex === -1) return false;

    // Verify the user is the course instructor
    if (courses[courseIndex].instructor !== user.id) return false;

    // Remove the course
    setCourses((prev) => prev.filter((course) => course.id !== courseId));

    // Update instructor's created courses
    if (user.createdCourses) {
      updateUser({
        createdCourses: user.createdCourses.filter((id) => id !== courseId),
      });
    }

    return true;
  };

  const addLesson = (
    courseId: string,
    lessonData: Omit<Lesson, 'id'>
  ): boolean => {
    if (!user || user.role !== 'instructor') return false;

    const courseIndex = courses.findIndex((c) => c.id === courseId);
    if (courseIndex === -1) return false;

    // Verify the user is the course instructor
    if (courses[courseIndex].instructor !== user.id) return false;

    const newLesson: Lesson = {
      ...lessonData,
      id: `lesson-${courseId}-${courses[courseIndex].lessons.length + 1}`,
    };

    const updatedCourses = [...courses];
    updatedCourses[courseIndex] = {
      ...updatedCourses[courseIndex],
      lessons: [...updatedCourses[courseIndex].lessons, newLesson],
      updatedAt: new Date(),
    };
    setCourses(updatedCourses);

    return true;
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    if (!user) return;

    setCourseProgress((prev) => {
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
    const course = courses.find((c) => c.id === courseId);
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
