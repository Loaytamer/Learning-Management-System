import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCourses } from '../../contexts/CourseContext';
import { useAuth } from '../../contexts/AuthContext';
import { Course, Lesson } from '../../data/courses';
import {
  ArrowLeft,
  Check,
  CheckCircle,
  Clock,
  ListChecks,
} from 'lucide-react-native';
import VideoPlayer from '../../components/ui/VideoPlayer';
import ProgressBar from '../../components/ui/ProgressBar';

export default function LessonScreen() {
  const params = useLocalSearchParams<{
    id: string;
    courseId?: string;
  }>();

  const id = params?.id;
  const courseId = params?.courseId;

  // Validate required parameters
  useEffect(() => {
    if (!id) {
      console.error('Lesson ID is required');
      router.replace('/courses');
      return;
    }
  }, [id]);
  const router = useRouter();
  const { user } = useAuth();
  const { courses, enrolledCourses, markLessonComplete, getProgress } =
    useCourses();

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [parentCourse, setParentCourse] = useState<Course | null>(null);
  const [lessonIndex, setLessonIndex] = useState<number>(0);

  // Find the lesson and its parent course
  useEffect(() => {
    if (!id) return; // Skip if no lesson ID is provided

    let foundLesson: Lesson | null = null;
    let foundCourse: Course | null = null;
    let foundIndex: number = 0;

    const findLessonInCourse = (
      course: Course
    ): { lesson: Lesson | null; index: number } => {
      if (!course.lessons || !Array.isArray(course.lessons)) {
        return { lesson: null, index: -1 };
      }

      const index = course.lessons.findIndex(
        (lesson) => String(lesson.id) === String(id)
      );

      return {
        lesson: index !== -1 ? course.lessons[index] : null,
        index: index,
      };
    };

    try {
      // If courseId is provided, first try to find the course by that ID
      if (courseId) {
        const specificCourse = courses.find(
          (course) => String(course.id) === String(courseId)
        );

        if (specificCourse) {
          const { lesson, index } = findLessonInCourse(specificCourse);
          if (lesson) {
            foundLesson = lesson;
            foundCourse = specificCourse;
            foundIndex = index;
          }
        }
      }

      // If we haven't found the lesson yet, search through all courses
      if (!foundLesson) {
        for (const course of courses) {
          const { lesson, index } = findLessonInCourse(course);
          if (lesson) {
            foundLesson = lesson;
            foundCourse = course;
            foundIndex = index;
            break;
          }
        }
      }

      if (!foundLesson || !foundCourse) {
        console.error('Lesson not found:', {
          lessonId: id,
          courseId: courseId,
          availableCourses: courses.map((c) => ({ id: c.id, title: c.title })),
        });
      }

      setCurrentLesson(foundLesson);
      setParentCourse(foundCourse);
      setLessonIndex(foundIndex);
    } catch (error) {
      console.error('Error finding lesson:', error);
      router.replace('/courses');
    }
  }, [id, courseId, courses]);

  if (!currentLesson || !parentCourse) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Lesson not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Check if user is enrolled in the course
  const isEnrolled = enrolledCourses.some(
    (course) => course.id === parentCourse.id
  );
  const isInstructor = user?.role === 'instructor';
  const canAccess =
    isEnrolled || isInstructor || parentCourse.instructor === user?.id;

  const handleLessonComplete = () => {
    markLessonComplete(parentCourse.id, currentLesson.id);
  };

  const navigateToNextLesson = () => {
    if (lessonIndex < parentCourse.lessons.length - 1) {
      // Get the next lesson based on array index
      const nextLesson = parentCourse.lessons[lessonIndex + 1];
      if (nextLesson) {
        router.replace({
          pathname: '/lesson/[id]',
          params: { id: nextLesson.id, courseId: parentCourse.id },
        });
      }
    } else {
      // This is the last lesson, return to course page
      router.replace({
        pathname: '/course/[id]',
        params: { id: parentCourse.id },
      });
    }
  };

  const navigateToPreviousLesson = () => {
    if (lessonIndex > 0) {
      // Get the previous lesson based on array index
      const prevLesson = parentCourse.lessons[lessonIndex - 1];
      if (prevLesson) {
        router.replace({
          pathname: '/lesson/[id]',
          params: { id: prevLesson.id, courseId: parentCourse.id },
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() =>
            router.push({
              pathname: '/course/[id]',
              params: { id: parentCourse.id },
            })
          }
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {parentCourse.title}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            Lesson {lessonIndex + 1} of {parentCourse.lessons.length}
          </Text>
          <ProgressBar
            progress={getProgress(parentCourse.id)}
            height={4}
            showLabel={false}
          />
        </View>

        <Text style={styles.lessonTitle}>{currentLesson.title}</Text>

        <View style={styles.durationContainer}>
          <Clock size={16} color="#9CA3AF" />
          <Text style={styles.durationText}>
            {currentLesson.duration} minutes
          </Text>
        </View>

        {!canAccess ? (
          <View style={styles.lockedContainer}>
            <Text style={styles.lockedText}>
              You need to enroll in this course to watch this lesson.
            </Text>
            <TouchableOpacity
              style={styles.enrollButton}
              onPress={() =>
                router.push({
                  pathname: '/course/[id]',
                  params: { id: parentCourse.id },
                })
              }
            >
              <Text style={styles.enrollButtonText}>Go to Course</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.videoContainer}>
            <VideoPlayer
              videoUrl={currentLesson.videoUrl}
              title={currentLesson.title}
              onComplete={handleLessonComplete}
            />
          </View>
        )}

        <Text style={styles.sectionTitle}>About this lesson</Text>
        <Text style={styles.description}>{currentLesson.description}</Text>

        {currentLesson.resources && currentLesson.resources.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Resources</Text>
            <View style={styles.resourcesList}>
              {currentLesson.resources.map((resource) => (
                <TouchableOpacity key={resource.id} style={styles.resourceItem}>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <Text style={styles.resourceType}>{resource.type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {canAccess && (
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={[
                styles.navButton,
                styles.prevButton,
                lessonIndex === 0 && styles.disabledButton,
              ]}
              onPress={navigateToPreviousLesson}
              disabled={lessonIndex === 0}
            >
              <Text style={styles.navButtonText}>Previous Lesson</Text>
            </TouchableOpacity>

            {lessonIndex < parentCourse.lessons.length - 1 ? (
              <TouchableOpacity
                style={[styles.navButton, styles.nextButton]}
                onPress={navigateToNextLesson}
              >
                <Text style={styles.navButtonText}>Next Lesson</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.navButton, styles.completeButton]}
                onPress={() =>
                  router.push({
                    pathname: '/course/[id]',
                    params: { id: parentCourse.id },
                  })
                }
              >
                <CheckCircle size={16} color="#FFFFFF" />
                <Text style={styles.completeButtonText}>Complete Course</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {canAccess && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.markCompleteButton}
            onPress={handleLessonComplete}
          >
            <Check size={20} color="#FFFFFF" />
            <Text style={styles.markCompleteText}>Mark as Complete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#1F2937',
  },
  backButtonContainer: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
    flex: 1,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  durationText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 6,
    fontFamily: 'Inter-Regular',
  },
  videoContainer: {
    height: 220,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 12,
    marginTop: 8,
    fontFamily: 'Inter-SemiBold',
  },
  description: {
    fontSize: 16,
    color: '#D1D5DB',
    lineHeight: 24,
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
  resourcesList: {
    marginBottom: 24,
  },
  resourceItem: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#F9FAFB',
    marginBottom: 4,
    fontFamily: 'Inter-Medium',
  },
  resourceType: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#6200EE',
  },
  prevButton: {
    backgroundColor: '#4B5563',
  },
  completeButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#374151',
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  markCompleteButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markCompleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 24,
    fontFamily: 'Inter-SemiBold',
  },
  backButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  lockedContainer: {
    backgroundColor: '#1F2937',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  lockedText: {
    fontSize: 16,
    color: '#D1D5DB',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
  },
  enrollButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  enrollButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
});
