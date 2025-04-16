import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { FontAwesome } from "@expo/vector-icons";

const DUMMY_COURSES = {
  programming: [
    {
      id: "1",
      title: "Introduction to Python Programming",
      instructor: "John Doe",
      duration: "8 weeks",
      level: "Beginner",
      rating: 4.8,
      students: 1234,
      image: "https://picsum.photos/200/150",
    },
    {
      id: "2",
      title: "Web Development with React",
      instructor: "Jane Smith",
      duration: "10 weeks",
      level: "Intermediate",
      rating: 4.9,
      students: 2345,
      image: "https://picsum.photos/200/150",
    },
  ],
  design: [
    {
      id: "3",
      title: "UI/UX Design Fundamentals",
      instructor: "Sarah Johnson",
      duration: "6 weeks",
      level: "Beginner",
      rating: 4.7,
      students: 987,
      image: "https://picsum.photos/200/150",
    },
  ],
};

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const courses = DUMMY_COURSES[id as keyof typeof DUMMY_COURSES] || [];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {id.charAt(0).toUpperCase() + id.slice(1)} Courses
      </Text>
      {courses.map((course) => (
        <TouchableOpacity key={course.id} style={styles.courseCard}>
          <Image source={{ uri: course.image }} style={styles.courseImage} />
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.instructorName}>by {course.instructor}</Text>
            <View style={styles.courseDetails}>
              <View style={styles.detailItem}>
                <FontAwesome name="clock-o" size={14} color="#666" />
                <Text style={styles.detailText}>{course.duration}</Text>
              </View>
              <View style={styles.detailItem}>
                <FontAwesome name="signal" size={14} color="#666" />
                <Text style={styles.detailText}>{course.level}</Text>
              </View>
            </View>
            <View style={styles.courseStats}>
              <View style={styles.detailItem}>
                <FontAwesome name="star" size={14} color="#FFD700" />
                <Text style={styles.detailText}>{course.rating}</Text>
              </View>
              <View style={styles.detailItem}>
                <FontAwesome name="users" size={14} color="#666" />
                <Text style={styles.detailText}>
                  {course.students} students
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7F9",
    padding: responsiveWidth(5),
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: responsiveHeight(2),
    color: "#000",
  },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: responsiveHeight(2),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
  },
  courseImage: {
    width: "100%",
    height: responsiveHeight(15),
  },
  courseInfo: {
    padding: responsiveWidth(4),
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  instructorName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  courseDetails: {
    flexDirection: "row",
    marginBottom: 8,
  },
  courseStats: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: responsiveWidth(4),
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
});
