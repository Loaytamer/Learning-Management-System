import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Play, CheckCircle, Clock, File } from 'lucide-react-native';
import { Lesson } from '../../data/courses';

interface LessonCardProps {
  lesson: Lesson;
  isCompleted?: boolean;
  onPress: (lesson: Lesson) => void;
  index: number;
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  isCompleted = false,
  onPress,
  index,
}) => {
  const handlePress = () => {
    onPress(lesson);
  };

  return (
    <TouchableOpacity
      style={[styles.container, isCompleted && styles.completedContainer]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.indexContainer}>
        <Text style={styles.indexText}>{index + 1}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {lesson.description}
        </Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Clock size={14} color="#9CA3AF" />
            <Text style={styles.metaText}>{lesson.duration} min</Text>
          </View>
          
          {lesson.resources && lesson.resources.length > 0 && (
            <View style={styles.metaItem}>
              <File size={14} color="#9CA3AF" />
              <Text style={styles.metaText}>
                {lesson.resources.length} resource{lesson.resources.length > 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.actionContainer}>
        {isCompleted ? (
          <CheckCircle size={24} color="#10B981" />
        ) : (
          <View style={styles.playButton}>
            <Play size={16} color="#FFFFFF" style={styles.playIcon} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  completedContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  indexContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  indexText: {
    color: '#D1D5DB',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  actionContainer: {
    marginLeft: 12,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6200EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    marginLeft: 2, // Adjust the play icon positioning
  },
});

export default LessonCard;