import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useCourses } from '../../contexts/CourseContext';
import { Clock, Award, BookOpen } from 'lucide-react-native';
import CourseCard from '../../components/ui/CourseCard';
import ProgressBar from '../../components/ui/ProgressBar';

export default function HomeScreen() {
  const { user } = useAuth();
  const { enrolledCourses, instructorCourses, courses, getProgress } = useCourses();
  const router = useRouter();

  const isInstructor = user?.role === 'instructor';
  const relevantCourses = isInstructor ? instructorCourses : enrolledCourses;
  const welcomeMessage = isInstructor 
    ? 'Welcome back, Instructor!' 
    : 'Continue Learning';

  // Get recommended courses (excluding enrolled ones)
  const recommendedCourses = courses
    .filter(course => !relevantCourses.some(c => c.id === course.id))
    .slice(0, 3);

  const renderCourseItem = ({ item }: { item: any }) => {
    return (
      <CourseCard 
        course={item} 
        isEnrolled={enrolledCourses.some(c => c.id === item.id)}
      />
    );
  };

  const navigateToCourse = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  const getTotalStats = () => {
    if (isInstructor) {
      const totalStudents = instructorCourses.reduce(
        (sum, course) => sum + course.enrolledStudents.length, 0
      );
      
      const totalHours = instructorCourses.reduce(
        (sum, course) => sum + course.duration, 0
      );
      
      return {
        courses: instructorCourses.length,
        students: totalStudents,
        hours: totalHours
      };
    } else {
      const totalHours = enrolledCourses.reduce(
        (sum, course) => sum + course.duration, 0
      );
      
      const completedCourses = enrolledCourses.filter(
        course => getProgress(course.id) >= 100
      ).length;
      
      return {
        courses: enrolledCourses.length,
        completed: completedCourses,
        hours: totalHours
      };
    }
  };

  const stats = getTotalStats();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.username?.split(' ')[0] || 'User'}</Text>
            <Text style={styles.subGreeting}>
              {isInstructor ? 'Manage your courses' : 'Let\'s continue learning'}
            </Text>
          </View>
          {user?.avatar && (
            <Image source={user.avatar} style={styles.avatar} />
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <BookOpen size={20} color="#6200EE" />
            </View>
            <Text style={styles.statValue}>{stats.courses}</Text>
            <Text style={styles.statLabel}>
              {isInstructor ? 'My Courses' : 'Enrolled'}
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              {isInstructor ? (
                <Award size={20} color="#F59E0B" />
              ) : (
                <Award size={20} color="#10B981" />
              )}
            </View>
            <Text style={styles.statValue}>
              {isInstructor ? stats.students : stats.completed}
            </Text>
            <Text style={styles.statLabel}>
              {isInstructor ? 'Students' : 'Completed'}
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Clock size={20} color="#3B82F6" />
            </View>
            <Text style={styles.statValue}>{stats.hours}</Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{welcomeMessage}</Text>
          {relevantCourses.length > 0 && (
            <TouchableOpacity onPress={() => router.push('/courses')}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          )}
        </View>

        {relevantCourses.length > 0 ? (
          <View>
            {relevantCourses.slice(0, 2).map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.courseProgress}
                onPress={() => navigateToCourse(course.id)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: course.thumbnail }}
                  style={styles.courseImage}
                />
                <View style={styles.courseProgressContent}>
                  <Text style={styles.courseCategory}>{course.category}</Text>
                  <Text style={styles.courseTitle} numberOfLines={1}>
                    {course.title}
                  </Text>
                  
                  {!isInstructor && (
                    <View style={styles.progressContainer}>
                      <ProgressBar
                        progress={getProgress(course.id)}
                        width={200}
                        height={6}
                      />
                    </View>
                  )}
                  
                  {isInstructor && (
                    <View style={styles.courseStats}>
                      <Text style={styles.courseStatText}>
                        {course.enrolledStudents.length} students
                      </Text>
                      <Text style={styles.courseStatText}>
                        {course.lessons.length} lessons
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCourses}>
            <BookOpen size={48} color="#4B5563" />
            <Text style={styles.emptyCoursesText}>
              {isInstructor
                ? 'You haven\'t created any courses yet'
                : 'You haven\'t enrolled in any courses yet'}
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => {isInstructor ? router.push('/create') : router.push('/courses')}}
            >
              <Text style={styles.browseButtonText}>
                {isInstructor ? 'Create Course' : 'Browse Courses'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {isInstructor ? 'Popular on Platform' : 'Recommended for You'}
          </Text>
        </View>

        <FlatList
          data={recommendedCourses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recommendedList}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F9FAFB',
    fontFamily: 'Inter-Bold',
  },
  subGreeting: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    fontFamily: 'Inter-SemiBold',
  },
  viewAllText: {
    fontSize: 14,
    color: '#6200EE',
    fontFamily: 'Inter-Medium',
  },
  courseProgress: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  courseImage: {
    width: 100,
    height: 100,
  },
  courseProgressContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  courseCategory: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
    marginVertical: 4,
    fontFamily: 'Inter-SemiBold',
  },
  progressContainer: {
    marginTop: 8,
  },
  courseStats: {
    flexDirection: 'row',
    marginTop: 8,
  },
  courseStatText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginRight: 12,
    fontFamily: 'Inter-Regular',
  },
  emptyCourses: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 32,
  },
  emptyCoursesText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  browseButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  recommendedList:{
    paddingHorizontal: 16, // Padding on the left and right for the list
  paddingVertical: 8, // Small vertical padding for breathing room
  gap: 16,
  }
});