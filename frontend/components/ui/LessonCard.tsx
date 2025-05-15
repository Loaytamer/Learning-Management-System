import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Play, CheckCircle, Clock, File, Lock } from 'lucide-react-native';
import { Lesson } from '../../data/courses';

interface LessonCardProps {
  lesson: Lesson;
  isCompleted?: boolean;
  isLocked?: boolean;
  onPress: (lesson: Lesson) => void;
  index: number;
  isCurrentLesson?: boolean;
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  isCompleted = false,
  isLocked = false,
  onPress,
  index,
  isCurrentLesson = false,
}) => {
  const handlePress = () => {
    if (!isLocked) {
      onPress(lesson);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isCompleted && styles.completedContainer,
        isCurrentLesson && styles.currentContainer,
        isLocked && styles.lockedContainer,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLocked}
    >
      <View style={[
        styles.indexContainer,
        isLocked && styles.lockedIndexContainer
      ]}>
        <Text style={[
          styles.indexText,
          isLocked && styles.lockedText
        ]}>{index}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[
            styles.title,
            isLocked && styles.lockedText
          ]}>{lesson.title}</Text>
          {isCurrentLesson && (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>Current</Text>
            </View>
          )}
        </View>
        
        <Text 
          style={[
            styles.description,
            isLocked && styles.lockedText
          ]} 
          numberOfLines={2}
        >
          {lesson.description}
        </Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Clock size={14} color={isLocked ? "#6B7280" : "#9CA3AF"} />
            <Text style={[
              styles.metaText,
              isLocked && styles.lockedText
            ]}>{lesson.duration} min</Text>
          </View>
          
          {lesson.resources && lesson.resources.length > 0 && (
            <View style={styles.metaItem}>
              <File size={14} color={isLocked ? "#6B7280" : "#9CA3AF"} />
              <Text style={[
                styles.metaText,
                isLocked && styles.lockedText
              ]}>
                {lesson.resources.length} resource{lesson.resources.length > 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.actionContainer}>
        {isLocked ? (
          <Lock size={20} color="#6B7280" />
        ) : isCompleted ? (
          <CheckCircle size={24} color="#10B981" />
        ) : (
          <View style={[
            styles.playButton,
            isCurrentLesson && styles.currentPlayButton
          ]}>
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
  currentContainer: {
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#6200EE',
  },
  lockedContainer: {
    backgroundColor: '#1F2937',
    opacity: 0.7,
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
  lockedIndexContainer: {
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
  },
  indexText: {
    color: '#D1D5DB',
    fontWeight: '600',
    fontSize: 14,
  },
  lockedText: {
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
    flex: 1,
  },
  currentBadge: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  currentBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
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
  currentPlayButton: {
    backgroundColor: '#6200EE',
    shadowColor: '#6200EE',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  playIcon: {
    marginLeft: 2,
  },
});

export default LessonCard;