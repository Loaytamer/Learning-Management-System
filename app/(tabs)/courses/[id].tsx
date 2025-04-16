import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { FontAwesome } from "@expo/vector-icons";

const DUMMY_COURSES = {
  programming: [
    {
      id: 1,
      title: "Introduction to Python",
      instructor: "John Doe",
      rating: 4.8,
      students: 1200,
      duration: "8 hours",
      level: "Beginner",
      image: "https://picsum.photos/200/200?random=1",
    },
    {
      id: 2,
      title: "Web Development Bootcamp",
      instructor: "Jane Smith",
      rating: 4.9,
      students: 2500,
      duration: "12 hours",
      level: "Intermediate",
      image: "https://picsum.photos/200/200?random=2",
    },
    {
      id: 3,
      title: "Data Structures & Algorithms",
      instructor: "Mike Johnson",
      rating: 4.7,
      students: 1800,
      duration: "10 hours",
      level: "Advanced",
      image: "https://picsum.photos/200/200?random=3",
    },
  ],
  design: [
    {
      id: 1,
      title: "UI/UX Design Fundamentals",
      instructor: "Sarah Wilson",
      rating: 4.9,
      students: 1500,
      duration: "6 hours",
      level: "Beginner",
      image: "https://picsum.photos/200/200?random=4",
    },
    {
      id: 2,
      title: "Adobe Photoshop Masterclass",
      instructor: "David Brown",
      rating: 4.8,
      students: 2000,
      duration: "8 hours",
      level: "Intermediate",
      image: "https://picsum.photos/200/200?random=5",
    },
  ],
  business: [
    {
      id: 1,
      title: "Business Management 101",
      instructor: "Robert Taylor",
      rating: 4.7,
      students: 3000,
      duration: "10 hours",
      level: "Beginner",
      image: "https://picsum.photos/200/200?random=6",
    },
    {
      id: 2,
      title: "Digital Marketing Strategy",
      instructor: "Emily Davis",
      rating: 4.9,
      students: 2200,
      duration: "8 hours",
      level: "Intermediate",
      image: "https://picsum.photos/200/200?random=7",
    },
  ],
};

const CATEGORY_NAMES = {
  programming: "Programming",
  design: "Design",
  business: "Business",
  marketing: "Marketing",
  language: "Language",
  science: "Science",
};

export default function CourseListScreen() {
  const { id } = useLocalSearchParams();
  const categoryName = CATEGORY_NAMES[id as keyof typeof CATEGORY_NAMES];
  const courses = DUMMY_COURSES[id as keyof typeof DUMMY_COURSES] || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{categoryName} Courses</Text>
      </View>

      <ScrollView style={styles.coursesContainer}>
        {courses.map((course) => (
          <TouchableOpacity key={course.id} style={styles.courseCard}>
            <Image source={{ uri: course.image }} style={styles.courseImage} />
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.instructor}>By {course.instructor}</Text>
              <View style={styles.ratingContainer}>
                <FontAwesome name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{course.rating}</Text>
                <Text style={styles.students}>
                  ({course.students} students)
                </Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detail}>{course.duration}</Text>
                <Text style={styles.detail}>{course.level}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7F9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: responsiveWidth(5),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: responsiveWidth(3),
    color: "#000",
  },
  coursesContainer: {
    flex: 1,
    padding: responsiveWidth(5),
  },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: responsiveHeight(2),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  courseImage: {
    width: "100%",
    height: 200,
  },
  courseInfo: {
    padding: responsiveWidth(4),
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  instructor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginLeft: 4,
    marginRight: 8,
  },
  students: {
    fontSize: 14,
    color: "#666",
  },
  detailsContainer: {
    flexDirection: "row",
    gap: responsiveWidth(3),
  },
  detail: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#E8EEF9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});
