import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useCourses } from '../../contexts/CourseContext';
import {
  ArrowLeft,
  Clock,
  Users,
  Star,
  Play,
  DollarSign,
  Plus,
  X,
  Upload,
} from 'lucide-react-native';
import LessonCard from '../../components/ui/LessonCard';
import { Lesson } from '../../data/courses';

interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  lastAccessedLessonId: string | null;
  quizScores: Record<string, number>;
}

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string; refresh?: string }>();
  const { user } = useAuth();
  const {
    getCourse,
    enrollInCourse,
    instructorCourses,
    enrolledCourses,
    addLesson,
    courseProgress,
    getProgress,
    loadCourses,
  } = useCourses();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      loadCourses();
    }
  }, [id]);

  const course = getCourse(id);
  const isEnrolled = course && enrolledCourses.some((c) => c.id === course.id);
  const isInstructor = user && user.role === 'instructor';

  // Add console logs for debugging
  console.log('Course:', course);
  console.log('User:', user);
  console.log('Course Instructor:', course?.instructor);
  console.log('User ID:', user?.id);

  // Fix the isOwner check to handle instructor object
  const isOwner =
    isInstructor &&
    course &&
    ((typeof course.instructor === 'object' &&
      course.instructor._id === user?.id) ||
      (typeof course.instructor === 'string' &&
        course.instructor === user?.id));

  console.log('Is Owner:', isOwner);
  console.log('Is Instructor:', isInstructor);
  console.log('Is Enrolled:', isEnrolled);

  const showEnrollButton = !isEnrolled && !isOwner;
  const showAddLessonButton = isOwner;

  const [isAddLessonModalVisible, setIsAddLessonModalVisible] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDescription, setNewLessonDescription] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState('');
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState('');

  if (!course) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Course not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(tabs)/courses')}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleEnroll = async () => {
    if (course) {
      try {
        const success = await enrollInCourse(course.id);
        if (success) {
          Alert.alert(
            'Enrolled Successfully',
            `You have successfully enrolled in ${course.title}!`,
            [
              {
                text: 'Start Learning',
                onPress: () => {
                  if (course.lessons && course.lessons.length > 0) {
                    router.push(`/lesson/${course.lessons[0].id}`);
                  }
                },
              },
              {
                text: 'View Course',
                style: 'default',
              },
            ]
          );
        }
      } catch (error: any) {
        Alert.alert(
          'Enrollment Failed',
          error.message || 'Failed to enroll in course. Please try again later.'
        );
      }
    }
  };

  const handleStartLearning = () => {
    if (course.lessons && course.lessons.length > 0) {
      // Find the last accessed lesson or start from the beginning
      const progress = courseProgress[course.id] || {
        courseId: course.id,
        completedLessons: [],
        lastAccessedLessonId: null,
        quizScores: {},
      };
      const lastLessonId = progress.lastAccessedLessonId;
      const firstUncompletedLesson = course.lessons.find(
        (lesson) => !progress.completedLessons.includes(lesson.id)
      );

      const targetLessonId =
        lastLessonId || firstUncompletedLesson?.id || course.lessons[0].id;
      router.push(`/lesson/${targetLessonId}`);
    } else {
      Alert.alert('No Lessons', 'This course has no lessons available yet.');
    }
  };

  const handleLessonPress = (lesson: Lesson) => {
    router.push(`/lesson/${lesson.id}`);
  };

  const handleAddLesson = () => {
    router.push(`/course/${id}/add-lesson`);
  };

  const submitNewLesson = async () => {
    if (
      !newLessonTitle ||
      !newLessonDescription ||
      !newLessonDuration ||
      !newLessonVideoUrl
    ) {
      Alert.alert('Missing Fields', 'Please fill in all fields');
      return;
    }

    const success = await addLesson(course.id, {
      title: newLessonTitle,
      description: newLessonDescription,
      duration: parseInt(newLessonDuration, 10),
      videoUrl: newLessonVideoUrl,
    });

    if (success) {
      setIsAddLessonModalVisible(false);
      setNewLessonTitle('');
      setNewLessonDescription('');
      setNewLessonDuration('');
      setNewLessonVideoUrl('');
      Alert.alert('Success', 'Lesson added successfully');
    } else {
      Alert.alert('Error', 'Failed to add lesson');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />

        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => router.push('/(tabs)/courses')}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{course.category}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{course.level}</Text>
            </View>
          </View>

          <Text style={styles.title}>{course.title}</Text>

          <View style={styles.instructorRow}>
            <Text style={styles.instructorText}>
              By {course.instructorName}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Clock size={16} color="#9CA3AF" />
              <Text style={styles.statText}>{course.duration}h</Text>
            </View>
            <View style={styles.statItem}>
              <Users size={16} color="#9CA3AF" />
              <Text style={styles.statText}>
                {course.enrolledStudents.length} students
              </Text>
            </View>
            <View style={styles.statItem}>
              <Star size={16} color="#F59E0B" />
              <Text style={styles.statText}>
                {course.rating.toFixed(1)} ({course.reviews})
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Course Progress Section */}
          {isEnrolled && (
            <View style={styles.progressSection}>
              <Text style={styles.sectionTitle}>Your Progress</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${getProgress(course.id)}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {getProgress(course.id)}% Complete
              </Text>
            </View>
          )}

          {/* Course Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About this course</Text>
            <Text style={styles.description}>{course.description}</Text>
          </View>

          {/* Course Content Section */}
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Course Content</Text>
            <Text style={styles.contentStats}>
              {course.lessons.length} lessons • {course.duration} total hours
            </Text>

            {course.lessons.map((lesson, index) => {
              const progress = courseProgress[course.id] || {
                courseId: course.id,
                completedLessons: [],
                lastAccessedLessonId: null,
                quizScores: {},
              };
              const isCompleted = progress.completedLessons.includes(lesson.id);
              const isCurrentLesson =
                progress.lastAccessedLessonId === lesson.id;
              const previousLessonCompleted =
                index === 0 ||
                (course.lessons[index - 1] &&
                  progress.completedLessons.includes(
                    course.lessons[index - 1].id
                  ));
              const isLocked =
                !isEnrolled ||
                (!isCompleted && !previousLessonCompleted && index !== 0);

              return (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  index={index + 1}
                  isCompleted={isCompleted}
                  isCurrentLesson={isCurrentLesson}
                  isLocked={isLocked}
                  onPress={() =>
                    isEnrolled ? handleLessonPress(lesson) : handleEnroll()
                  }
                />
              );
            })}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {isEnrolled ? (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleStartLearning}
              >
                <Play size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>
                  {courseProgress[course.id]?.lastAccessedLessonId
                    ? 'Continue Learning'
                    : 'Start Learning'}
                </Text>
              </TouchableOpacity>
            ) : showEnrollButton ? (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleEnroll}
              >
                <Text style={styles.buttonText}>
                  Enroll Now -{' '}
                  {course.price ? `$${course.price.toFixed(2)}` : 'Free'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {showAddLessonButton && (
            <TouchableOpacity
              style={styles.addLessonButton}
              onPress={handleAddLesson}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.addLessonButtonText}>Add Lesson</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={isAddLessonModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddLessonModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Lesson</Text>
              <TouchableOpacity
                onPress={() => setIsAddLessonModalVisible(false)}
              >
                <X size={24} color="#D1D5DB" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Lesson Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter lesson title"
                  placeholderTextColor="#9CA3AF"
                  value={newLessonTitle}
                  onChangeText={setNewLessonTitle}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Enter lesson description"
                  placeholderTextColor="#9CA3AF"
                  value={newLessonDescription}
                  onChangeText={setNewLessonDescription}
                  multiline
                  numberOfLines={Platform.OS === 'ios' ? 0 : 4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Duration (minutes) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 45"
                  placeholderTextColor="#9CA3AF"
                  value={newLessonDuration}
                  onChangeText={setNewLessonDuration}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Video URL *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter video URL"
                  placeholderTextColor="#9CA3AF"
                  value={newLessonVideoUrl}
                  onChangeText={setNewLessonVideoUrl}
                />
                <Text style={styles.helperText}>
                  This would be a VideoCipher URL in a real application
                </Text>
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={submitNewLesson}
              >
                <Upload size={20} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add Lesson</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  thumbnail: {
    width: '100%',
    height: 240,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: '#9CA3AF',
    marginRight: 12,
    fontFamily: 'Inter-Regular',
  },
  levelBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  levelText: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 8,
    lineHeight: 32,
    fontFamily: 'Inter-Bold',
  },
  instructorRow: {
    marginBottom: 12,
  },
  instructorText: {
    fontSize: 16,
    color: '#D1D5DB',
    fontFamily: 'Inter-Regular',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginLeft: 6,
    fontFamily: 'Inter-Regular',
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 24,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F9FAFB',
    marginLeft: 4,
    fontFamily: 'Inter-Bold',
  },
  enrollButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  enrollButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  startLearningButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  startLearningText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  description: {
    fontSize: 16,
    color: '#D1D5DB',
    lineHeight: 24,
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
  lessonsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addLessonButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  addLessonButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  emptyLessons: {
    backgroundColor: '#1F2937',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyLessonsText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F9FAFB',
    fontFamily: 'Inter-SemiBold',
  },
  modalForm: {
    maxHeight: '90%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D1D5DB',
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    backgroundColor: '#374151',
    borderRadius: 8,
    minHeight: 120,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  helperText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    fontFamily: 'Inter-Regular',
  },
  addButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  progressSection: {
    marginVertical: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
  },
  descriptionSection: {
    marginVertical: 20,
  },
  contentSection: {
    marginVertical: 20,
  },
  contentStats: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  actionButtons: {
    marginVertical: 24,
  },
  primaryButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
