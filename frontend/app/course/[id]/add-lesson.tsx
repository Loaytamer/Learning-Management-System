import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCourses } from '../../../contexts/CourseContext';
import { useAuth } from '../../../contexts/AuthContext';
import { BookOpen, Plus } from 'lucide-react-native';

export default function AddLessonScreen() {
  const router = useRouter();
  const { id: courseId } = useLocalSearchParams();
  const { addLesson } = useCourses();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [duration, setDuration] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddLesson = async () => {
    // Validate required fields
    if (!title || !content || !duration || !videoUrl) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const lessonData = {
        title,
        description: content,
        duration: parseInt(duration, 10),
        videoUrl,
        order: 0, // This will be handled by the backend
      };

      const success = await addLesson(courseId as string, lessonData);

      if (success) {
        setIsSubmitting(false);
        Alert.alert(
          'Lesson Added',
          'Your lesson has been added successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setTitle('');
                setContent('');
                setDuration('');
                setVideoUrl('');

                // Navigate back to course details
                router.back();
              },
            },
          ]
        );
      } else {
        throw new Error('Failed to add lesson');
      }
    } catch (error: any) {
      console.error('Error adding lesson:', error);
      setIsSubmitting(false);
      Alert.alert(
        'Error',
        error.message || 'Failed to add lesson. Please try again.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Lesson</Text>
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Lesson Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter lesson title"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Content *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter lesson content"
              placeholderTextColor="#9CA3AF"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={Platform.OS === 'ios' ? 0 : 8}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Duration (minutes) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 30"
              placeholderTextColor="#9CA3AF"
              value={duration}
              onChangeText={setDuration}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Video URL *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter video URL"
              placeholderTextColor="#9CA3AF"
              value={videoUrl}
              onChangeText={setVideoUrl}
            />
            <Text style={styles.helperText}>
              Provide a URL for your lesson video
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleAddLesson}
            disabled={isSubmitting}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Adding Lesson...' : 'Add Lesson'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F9FAFB',
    fontFamily: 'Inter-Bold',
  },
  scrollContent: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D1D5DB',
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    minHeight: 200,
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
  button: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#4B5563',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
});
