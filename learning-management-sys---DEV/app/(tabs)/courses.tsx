import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { useCourses } from '../../contexts/CourseContext';
import { useAuth } from '../../contexts/AuthContext';
import CourseCard from '../../components/ui/CourseCard';
import { Search, Filter, X } from 'lucide-react-native';
import { Course } from '@/data/courses';

export default function CoursesScreen() {
  const { courses, enrolledCourses, enrollInCourse } = useCourses();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // Extract unique categories from courses
  const categories = Array.from(new Set(courses.map(course => course.category)));

  // Extract unique levels from courses
  const levels = Array.from(new Set(courses.map(course => course.level)));

  const filteredCourses = courses.filter(course => {
    // Apply search filter
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply category filter
    const matchesCategory = !selectedCategory || course.category === selectedCategory;

    // Apply level filter
    const matchesLevel = !selectedLevel || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleEnroll = async (courseId: string): Promise<boolean> => {
    try {
      return await enrollInCourse(courseId);
    } catch (error) {
      console.error('Failed to enroll:', error);
      return false;
    }
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedLevel(null);
  };

  const renderCourseItem = ({ item }: { item: Course }) => {
    return (
      <CourseCard
        course={item}
        onEnroll={handleEnroll}
        isEnrolled={enrolledCourses.some(c => c.id === item.id)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Browse Courses</Text>

        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.filterHeader}>
          <View style={styles.filterTitleContainer}>
            <Filter size={16} color="#D1D5DB" />
            <Text style={styles.filterTitle}>Filters</Text>
          </View>

          {(selectedCategory || selectedLevel) && (
            <TouchableOpacity onPress={resetFilters}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.filterLabel}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsContainer}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterPill,
                selectedCategory === category && styles.filterPillActive,
              ]}
              onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedCategory === category && styles.filterPillTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.filterLabel}>Level</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsContainer}>
          {levels.map(level => (
            <TouchableOpacity
              key={level}
              style={[
                styles.filterPill,
                selectedLevel === level && styles.filterPillActive,
              ]}
              onPress={() => setSelectedLevel(selectedLevel === level ? null : level)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedLevel === level && styles.filterPillTextActive,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredCourses}
        renderItem={renderCourseItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No courses match your filters</Text>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D1D5DB',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  resetText: {
    fontSize: 14,
    color: '#6200EE',
    fontFamily: 'Inter-Medium',
  },
  filterLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  pillsContainer: {
    paddingBottom: 12,
  },
  filterPill: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: 'rgba(98, 0, 238, 0.2)',
    borderWidth: 1,
    borderColor: '#6200EE',
  },
  filterPillText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  filterPillTextActive: {
    color: '#6200EE',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    marginTop: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#D1D5DB',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  resetButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});