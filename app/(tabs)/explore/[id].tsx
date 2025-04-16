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
      id: "1",
      title: "Introduction to Python Programming",
      instructor: "John Doe",
      duration: "8 weeks",
      level: "Beginner",
      rating: 4.8,
      students: 1234,
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
    },
    {
      id: "2",
      title: "Web Development with React",
      instructor: "Jane Smith",
      duration: "10 weeks",
      level: "Intermediate",
      rating: 4.9,
      students: 2345,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    },
    {
      id: "3",
      title: "Advanced JavaScript Concepts",
      instructor: "Mike Johnson",
      duration: "12 weeks",
      level: "Advanced",
      rating: 4.7,
      students: 1876,
      image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a",
    },
  ],
  design: [
    {
      id: "4",
      title: "UI/UX Design Fundamentals",
      instructor: "Sarah Johnson",
      duration: "6 weeks",
      level: "Beginner",
      rating: 4.7,
      students: 987,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    },
    {
      id: "5",
      title: "Adobe Photoshop Masterclass",
      instructor: "David Wilson",
      duration: "8 weeks",
      level: "Intermediate",
      rating: 4.6,
      students: 1543,
      image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea",
    },
    {
      id: "6",
      title: "Product Design Workshop",
      instructor: "Emily Brown",
      duration: "5 weeks",
      level: "Advanced",
      rating: 4.9,
      students: 756,
      image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e",
    },
  ],
  business: [
    {
      id: "7",
      title: "Entrepreneurship 101",
      instructor: "Robert Chen",
      duration: "10 weeks",
      level: "Beginner",
      rating: 4.8,
      students: 2341,
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
    },
    {
      id: "8",
      title: "Digital Marketing Strategy",
      instructor: "Lisa Anderson",
      duration: "6 weeks",
      level: "Intermediate",
      rating: 4.5,
      students: 1654,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    },
    {
      id: "9",
      title: "Financial Management",
      instructor: "Michael Chang",
      duration: "8 weeks",
      level: "Advanced",
      rating: 4.7,
      students: 987,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    },
  ],
  marketing: [
    {
      id: "10",
      title: "Social Media Marketing",
      instructor: "Emma Davis",
      duration: "6 weeks",
      level: "Beginner",
      rating: 4.6,
      students: 2156,
      image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a",
    },
    {
      id: "11",
      title: "Content Marketing Mastery",
      instructor: "Chris Wilson",
      duration: "8 weeks",
      level: "Intermediate",
      rating: 4.8,
      students: 1432,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
    },
    {
      id: "12",
      title: "Email Marketing Strategies",
      instructor: "Sophie Turner",
      duration: "4 weeks",
      level: "Advanced",
      rating: 4.7,
      students: 876,
      image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa",
    },
  ],
  language: [
    {
      id: "13",
      title: "Spanish for Beginners",
      instructor: "Maria Garcia",
      duration: "12 weeks",
      level: "Beginner",
      rating: 4.9,
      students: 3421,
      image: "https://images.unsplash.com/photo-1505902987837-9e40ec37e607",
    },
    {
      id: "14",
      title: "Business English",
      instructor: "James Miller",
      duration: "10 weeks",
      level: "Intermediate",
      rating: 4.7,
      students: 2134,
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d",
    },
    {
      id: "15",
      title: "Japanese Language and Culture",
      instructor: "Yuki Tanaka",
      duration: "16 weeks",
      level: "Beginner",
      rating: 4.8,
      students: 1567,
      image: "https://images.unsplash.com/photo-1528164344705-47542687000d",
    },
  ],
  science: [
    {
      id: "16",
      title: "Introduction to Physics",
      instructor: "Dr. Alan Cooper",
      duration: "14 weeks",
      level: "Beginner",
      rating: 4.6,
      students: 1876,
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d",
    },
    {
      id: "17",
      title: "Chemistry Fundamentals",
      instructor: "Dr. Sarah Lee",
      duration: "12 weeks",
      level: "Intermediate",
      rating: 4.7,
      students: 1543,
      image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6",
    },
    {
      id: "18",
      title: "Astronomy: Exploring the Universe",
      instructor: "Dr. Neil Parker",
      duration: "10 weeks",
      level: "Beginner",
      rating: 4.9,
      students: 2341,
      image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
    },
  ],
};

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const courses = DUMMY_COURSES[id as keyof typeof DUMMY_COURSES] || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {id.charAt(0).toUpperCase() + id.slice(1)} Courses
        </Text>
      </View>
      <ScrollView style={styles.coursesContainer}>
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
