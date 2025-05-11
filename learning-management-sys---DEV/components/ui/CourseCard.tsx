import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Course } from '../../data/courses';
import { Clock, Users, Star } from 'lucide-react-native';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => Promise<boolean>;
  isEnrolled?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll, isEnrolled = false }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePress = () => {
    router.push(`/course/${course.id}`);
  };

  const handleEnroll = async () => {
    if (onEnroll) {
      setIsLoading(true);
      try {
        await onEnroll(course.id);
      } catch (error) {
        console.error('Failed to enroll:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.8}>
      <ImageBackground
        source={course.thumbnail ? { uri: course.thumbnail } : require('../../assets/images/course-placeholder.png')}
        style={styles.image}
        imageStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        defaultSource={require('../../assets/images/course-placeholder.png')}
      >
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{course.level}</Text>
        </View>
      </ImageBackground>
      
      <View style={styles.content}>
        <Text style={styles.category}>{course.category}</Text>
        <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
        
        <View style={styles.instructorRow}>
          <Text style={styles.instructorText}>By {course.instructorName}</Text>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Clock size={14} color="#9CA3AF" />
            <Text style={styles.statText}>{course.duration}h</Text>
          </View>
          <View style={styles.statItem}>
            <Users size={14} color="#9CA3AF" />
            <Text style={styles.statText}>{course.enrolledStudents.length}</Text>
          </View>
          <View style={styles.statItem}>
            <Star size={14} color="#F59E0B" />
            <Text style={styles.statText}>{course.rating.toFixed(1)}</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.price}>${course.price.toFixed(2)}</Text>
          {!isEnrolled && onEnroll && (
            <TouchableOpacity 
              style={[styles.enrollButton, isLoading && styles.enrollButtonDisabled]} 
              onPress={handleEnroll}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Text style={styles.enrollText}>{isLoading ? 'Enrolling...' : 'Enroll'}</Text>
            </TouchableOpacity>
          )}
          {isEnrolled && (
            <View style={styles.enrolledBadge}>
              <Text style={styles.enrolledText}>Enrolled</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  enrollButtonDisabled: {
    backgroundColor: '#4B5563',
    opacity: 0.7,
  },
  image: {
    height: 160,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 12,
  },
  levelBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  category: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 22,
  },
  instructorRow: {
    marginBottom: 8,
  },
  instructorText: {
    color: '#D1D5DB',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    color: '#F9FAFB',
    fontSize: 18,
    fontWeight: '700',
  },
  enrollButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  enrollText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  enrolledBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  enrolledText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default CourseCard;