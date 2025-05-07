import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useCourses } from '../../contexts/CourseContext';
import { useAuth } from '../../contexts/AuthContext';
import { UploadCloud, BookOpen, Info, Plus } from 'lucide-react-native';

export default function CreateCourseScreen() {
  const router = useRouter();
  const { createCourse } = useCourses();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState('https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=600');
  const [duration, setDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const levels: Array<'Beginner' | 'Intermediate' | 'Advanced'> = ['Beginner', 'Intermediate', 'Advanced'];

  if (!user || user.role !== 'instructor') {
    return (
      <View style={styles.unauthorizedContainer}>
        <Info size={60} color="#9CA3AF" />
        <Text style={styles.unauthorizedText}>
          Only instructors can access this page
        </Text>
      </View>
    );
  }

  const handleCreate = () => {
    // Validate required fields
    if (!title || !description || !category || !level || !thumbnail || !price || !duration) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const newCourse = createCourse({
        title,
        description,
        category,
        level,
        thumbnail,
        price: parseFloat(price),
        duration: parseInt(duration, 10),
        lessons: [],
        rating: 0,
        reviews: 0,
      });

      setIsSubmitting(false);
      Alert.alert(
        'Course Created',
        'Your course has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setTitle('');
              setDescription('');
              setCategory('');
              setLevel('Beginner');
              setPrice('');
              setThumbnail('https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=600');
              setDuration('');
              
              // Navigate to the course
              router.push(`/course/${newCourse.id}`);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error creating course:', error);
      setIsSubmitting(false);
      Alert.alert('Error', 'Failed to create course');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Course</Text>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Course Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter course title"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter course description"
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={Platform.OS === 'ios' ? 0 : 4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Category *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Web Development"
                placeholderTextColor="#9CA3AF"
                value={category}
                onChangeText={setCategory}
              />
            </View>
            
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Level *</Text>
              <View style={styles.levelSelector}>
                {levels.map((lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    style={[
                      styles.levelButton,
                      level === lvl && styles.levelButtonActive,
                    ]}
                    onPress={() => setLevel(lvl)}
                  >
                    <Text
                      style={[
                        styles.levelButtonText,
                        level === lvl && styles.levelButtonTextActive,
                      ]}
                    >
                      {lvl}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Price ($) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 49.99"
                placeholderTextColor="#9CA3AF"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
              />
            </View>
            
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Duration (hours) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 10"
                placeholderTextColor="#9CA3AF"
                value={duration}
                onChangeText={setDuration}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Thumbnail URL *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter thumbnail URL"
              placeholderTextColor="#9CA3AF"
              value={thumbnail}
              onChangeText={setThumbnail}
            />
            <Text style={styles.helperText}>
              Provide a URL for your course thumbnail image
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={isSubmitting}
          >
            <BookOpen size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Creating Course...' : 'Create Course'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.noteText}>
            * After creating your course, you'll be able to add lessons and content.
          </Text>
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelSelector: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 8,
    height: 48,
    overflow: 'hidden',
  },
  levelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelButtonActive: {
    backgroundColor: 'rgba(98, 0, 238, 0.2)',
  },
  levelButtonText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  levelButtonTextActive: {
    color: '#6200EE',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
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
  noteText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  unauthorizedText: {
    fontSize: 18,
    color: '#D1D5DB',
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});