import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { DUMMY_COURSES } from "../[id]";

const { width } = Dimensions.get("window");

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();

  // Find the course in all categories
  const course = Object.values(DUMMY_COURSES)
    .flat()
    .find((course) => course.id === id);

  if (!course) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Course not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: course.image }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>{course.title}</Text>

        <View style={styles.instructorRow}>
          <FontAwesome name="user-circle" size={20} color="#666" />
          <Text style={styles.instructor}>{course.instructor}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <FontAwesome name="clock-o" size={16} color="#666" />
            <Text style={styles.statText}>{course.duration}</Text>
          </View>

          <View style={styles.statItem}>
            <FontAwesome name="signal" size={16} color="#666" />
            <Text style={styles.statText}>{course.level}</Text>
          </View>

          <View style={styles.statItem}>
            <FontAwesome name="star" size={16} color="#FFD700" />
            <Text style={styles.statText}>{course.rating}</Text>
          </View>

          <View style={styles.statItem}>
            <FontAwesome name="users" size={16} color="#666" />
            <Text style={styles.statText}>{course.students}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this course</Text>
          <Text style={styles.description}>
            Learn {course.title} with {course.instructor} in this comprehensive{" "}
            {course.duration} course. Perfect for {course.level.toLowerCase()}{" "}
            level students. Join {course.students} other students who have
            already enrolled!
          </Text>
        </View>

        <TouchableOpacity style={styles.enrollButton}>
          <Text style={styles.enrollButtonText}>Enroll Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 50,
  },
  image: {
    width: width,
    height: width * 0.6,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  instructorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  instructor: {
    fontSize: 16,
    color: "#666",
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statText: {
    color: "#666",
    marginTop: 5,
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  enrollButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  enrollButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
