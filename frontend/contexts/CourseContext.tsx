import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Lesson } from '../data/courses';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import * as courseAPI from '../api/courses';
import { scheduleLocalNotification } from '../services/notifications';

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
  ) => Promise<Course>;
  updateCourse: (
    courseId: string,
    courseData: Partial<Course>
  ) => Promise<boolean>;
  deleteCourse: (courseId: string) => Promise<boolean>;
  addLesson: (courseId: string, lesson: Omit<Lesson, 'id'>) => Promise<boolean>;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  getProgress: (courseId: string) => number;
  loadCourses: () => Promise<void>;
}

const CourseContext = createContext<CourseContextProps>({
  courses: [],
  enrolledCourses: [],
  instructorCourses: [],
  courseProgress: {},
  getCourse: () => undefined,
  enrollInCourse: async (courseId: string) => false,
  unenrollFromCourse: async (courseId: string) => false,
  createCourse: async (
    courseData: Omit<
      Course,
      | 'id'
      | 'instructor'
      | 'instructorName'
      | 'enrolledStudents'
      | 'createdAt'
      | 'updatedAt'
    >
  ) => ({} as Course),
  updateCourse: async (courseId: string, courseData: Partial<Course>) => false,
  deleteCourse: async (courseId: string) => false,
  addLesson: async (courseId: string, lessonData: Omit<Lesson, 'id'>) => false,
  markLessonComplete: () => {},
  getProgress: () => 0,
  loadCourses: async () => {},
});

export const useCourses = () => useContext(CourseContext);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotifications();
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<
    Record<string, CourseProgress>
  >({});

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const coursesData = await courseAPI.getAllCourses();
      console.log(
        'Loaded courses data:',
        coursesData.map((course) => ({
          id: course.id,
          title: course.title,
          instructor: course.instructor,
          instructorName: course.instructorName,
        }))
      );
      setCourses(coursesData);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  // Filter courses for the current user
  const enrolledCourses =
    user && user.id
      ? courses.filter(
          (course) =>
            course.enrolledStudents && course.enrolledStudents.includes(user.id)
        )
      : [];

  const instructorCourses =
    user?.role === 'instructor' && user.id
      ? courses.filter(
          (course) =>
            course.instructor && course.instructor.toString() === user.id
        )
      : [];

  const getCourse = (id: string): Course | undefined => {
    if (!id) return undefined;
    const course = courses.find((course) => course && course.id === id);
    if (!course) console.warn(`Course with id ${id} not found in local state`);
    return course;
  };

  const enrollInCourse = async (courseId: string): Promise<boolean> => {
    if (!user) {
      console.error('User not authenticated');
      throw new Error('You must be logged in to enroll in a course');
    }

    try {
      // Validate course exists in the database
      const courseData = await courseAPI.getCourseById(courseId);
      if (!courseData) {
        console.error(`Course with id ${courseId} not found in database`);
        throw new Error('Course not found');
      }

      if (courseData.enrolledStudents?.includes(user.id)) {
        console.warn(
          `User ${user.id} is already enrolled in course ${courseId}`
        );
        throw new Error('You are already enrolled in this course');
      }

      // Perform enrollment via API
      const response = await courseAPI.enrollInCourse(courseId);
      if (!response) {
        throw new Error('Enrollment failed on server');
      }

      // Update user enrolledCourses in the database
      const updatedUserEnrolledCourses = user.enrolledCourses
        ? [...user.enrolledCourses, courseId]
        : [courseId];
      await updateUser({ enrolledCourses: updatedUserEnrolledCourses });

      // Refresh local course state
      await loadCourses();

      // Initialize or update course progress
      setCourseProgress((prev) => ({
        ...prev,
        [courseId]: {
          courseId,
          completedLessons: [],
          lastAccessedLessonId: null,
          quizScores: {},
        },
      }));

      // Add in-app notification
      addNotification({
        title: 'Course Enrollment Successful',
        message: `You have successfully enrolled in ${courseData.title}`,
        type: 'course_update',
      });

      // Send local notification
      await scheduleLocalNotification({
        title: 'Course Enrollment Successful',
        body: `You have successfully enrolled in ${courseData.title}. Start learning now!`,
        data: {
          courseId,
          type: 'enrollment',
        },
      });

      console.log(`Successfully enrolled in course ${courseId}`);
      return true;
    } catch (error: any) {
      console.error('Failed to enroll in course:', error.message);

      // Add error notification
      addNotification({
        title: 'Enrollment Failed',
        message: error.message || 'Failed to enroll in course',
        type: 'system',
      });

      throw error instanceof Error
        ? error
        : new Error(error.message || 'Failed to enroll in course');
    }
  };

  const unenrollFromCourse = async (courseId: string): Promise<boolean> => {
    if (!user) {
      console.error('User not authenticated');
      return false;
    }

    try {
      const course = await courseAPI.getCourseById(courseId);
      if (!course) {
        console.error(`Course with id ${courseId} not found in database`);
        throw new Error('Course not found');
      }

      const response = await courseAPI.unenrollFromCourse(courseId);
      if (!response) {
        throw new Error('Unenrollment failed on server');
      }

      // Update user enrolledCourses in the database
      const updatedUserEnrolledCourses = user.enrolledCourses
        ? user.enrolledCourses.filter((id) => id !== courseId)
        : [];
      await updateUser({ enrolledCourses: updatedUserEnrolledCourses });

      // Refresh local course state
      await loadCourses();

      console.log(`Successfully unenrolled from course ${courseId}`);
      return true;
    } catch (error: any) {
      console.error('Failed to unenroll from course:', error.message);
      return false;
    }
  };

  const createCourse = async (
    courseData: Omit<
      Course,
      | 'id'
      | 'instructor'
      | 'instructorName'
      | 'enrolledStudents'
      | 'createdAt'
      | 'updatedAt'
    >
  ): Promise<Course> => {
    if (!user || user.role !== 'instructor') {
      console.error('Only instructors can create courses');
      throw new Error('Only instructors can create courses');
    }

    try {
      const newCourse = await courseAPI.createCourse({
        ...courseData,
        instructor: user.id,
        instructorName: user.username,
        enrolledStudents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await loadCourses();
      console.log(`Successfully created course with id ${newCourse.id}`);
      return newCourse;
    } catch (error) {
      console.error('Failed to create course:', error);
      throw error;
    }
  };

  const updateCourse = async (
    courseId: string,
    courseData: Partial<Course>
  ): Promise<boolean> => {
    if (!user || user.role !== 'instructor') {
      console.error('Only instructors can update courses');
      return false;
    }

    try {
      const course = await courseAPI.getCourseById(courseId);
      if (!course || course.instructor !== user.id) {
        console.error(
          `User ${user.id} not authorized to update course ${courseId}`
        );
        throw new Error('Not authorized to update this course');
      }

      const success = await courseAPI.updateCourse(courseId, courseData);
      await loadCourses();
      console.log(`Successfully updated course ${courseId}`);
      return success;
    } catch (error) {
      console.error('Failed to update course:', error);
      return false;
    }
  };

  const deleteCourse = async (courseId: string): Promise<boolean> => {
    if (!user || user.role !== 'instructor') {
      console.error('Only instructors can delete courses');
      return false;
    }

    try {
      const course = await courseAPI.getCourseById(courseId);
      if (!course || course.instructor !== user.id) {
        console.error(
          `User ${user.id} not authorized to delete course ${courseId}`
        );
        throw new Error('Not authorized to delete this course');
      }

      const success = await courseAPI.deleteCourse(courseId);
      await loadCourses();
      console.log(`Successfully deleted course ${courseId}`);
      return success;
    } catch (error) {
      console.error('Failed to delete course:', error);
      return false;
    }
  };

  const addLesson = async (
    courseId: string,
    lessonData: Omit<Lesson, 'id'>
  ): Promise<boolean> => {
    if (!user || user.role !== 'instructor') {
      console.error('Only instructors can add lessons');
      return false;
    }

    try {
      const course = await courseAPI.getCourseById(courseId);
      if (!course) {
        console.error(`Course with id ${courseId} not found in database`);
        throw new Error('Course not found');
      }

      // Fix the instructor check to handle both object and string formats
      const isAuthorized =
        (typeof course.instructor === 'object' &&
          course.instructor._id === user.id) ||
        (typeof course.instructor === 'string' &&
          course.instructor === user.id);

      if (!isAuthorized) {
        console.error(
          `User ${user.id} not authorized to add lesson to course ${courseId}`
        );
        throw new Error('Not authorized to add lessons to this course');
      }

      try {
        console.log('Sending lesson data to API:', lessonData);
        const success = await courseAPI.addLesson(courseId, lessonData);
        if (success) {
          // Refresh the courses to get the updated lesson list
          console.log('Lesson added successfully, refreshing courses...');
          await loadCourses();

          // Double-check that the course was updated with the new lesson
          const updatedCourse = await courseAPI.getCourseById(courseId);
          if (updatedCourse) {
            console.log(
              `Updated course has ${updatedCourse.lessons?.length || 0} lessons`
            );
            // Force update the local courses array with the updated course
            setCourses((prevCourses) => {
              return prevCourses.map((c) => {
                if (c.id === courseId) {
                  return updatedCourse;
                }
                return c;
              });
            });
          }

          console.log(`Successfully added lesson to course ${courseId}`);
          return true;
        }
        return false;
      } catch (apiError: any) {
        console.error('API Error adding lesson:', apiError);
        throw apiError; // Propagate the specific API error
      }
    } catch (error) {
      console.error('Failed to add lesson:', error);
      throw error;
    }
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
    const course = getCourse(courseId);
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
        loadCourses,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
