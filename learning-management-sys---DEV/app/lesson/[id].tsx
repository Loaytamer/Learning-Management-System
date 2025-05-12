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
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { courses, enrolledCourses, markLessonComplete, getProgress } =
    useCourses();

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [parentCourse, setParentCourse] = useState<Course | null>(null);
  const [lessonIndex, setLessonIndex] = useState<number>(0);

  // Find the lesson and its parent course
  useEffect(() => {
    let foundLesson: Lesson | null = null;
    let foundCourse: Course | null = null;
    let foundIndex: number = 0;

    // Debug logging
    console.log('Looking for lesson with ID:', id);
    console.log(
      'Available courses:',
      courses.map((c) => c.title)
    );

    for (const course of courses) {
      if (!course.lessons || !Array.isArray(course.lessons)) {
        console.log(`Course ${course.title} has no lessons array`);
        continue;
      }

      console.log(
        `Checking course ${course.title} with ${course.lessons.length} lessons`
      );

      // Try to find by exact match first
      const index = course.lessons.findIndex((lesson) => lesson.id === id);
      if (index !== -1) {
        foundLesson = course.lessons[index];
        foundCourse = course;
        foundIndex = index;
        console.log('Found lesson by exact ID match:', foundLesson.title);
        break;
      }

      // If not found, try with string comparison (in case of type mismatch)
      const indexByString = course.lessons.findIndex(
        (lesson) => String(lesson.id) === String(id)
      );
      if (indexByString !== -1) {
        foundLesson = course.lessons[indexByString];
        foundCourse = course;
        foundIndex = indexByString;
        console.log('Found lesson by string ID comparison:', foundLesson.title);
        break;
      }
    }

    if (!foundLesson) {
      console.log('No lesson found with ID:', id);
    }

    setCurrentLesson(foundLesson);
    setParentCourse(foundCourse);
    setLessonIndex(foundIndex);
  }, [id, courses]);

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
      const nextLessonId = parentCourse.lessons[lessonIndex + 1].id;
      router.replace(`/lesson/${nextLessonId}`);
    } else {
      // This is the last lesson
      router.replace(`/course/${parentCourse.id}`);
    }
  };

  const navigateToPreviousLesson = () => {
    if (lessonIndex > 0) {
      const prevLessonId = parentCourse.lessons[lessonIndex - 1].id;
      router.replace(`/lesson/${prevLessonId}`);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => router.push(`/course/${parentCourse.id}`)}
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
              onPress={() => router.push(`/course/${parentCourse.id}`)}
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
                onPress={() => router.push(`/course/${parentCourse.id}`)}
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
