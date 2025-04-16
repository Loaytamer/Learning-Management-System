import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

const DUMMY_CATEGORIES = [
  {
    id: "programming",
    name: "Programming",
    icon: "code",
    courses: 12,
  },
  {
    id: "design",
    name: "Design",
    icon: "paint-brush",
    courses: 8,
  },
  {
    id: "business",
    name: "Business",
    icon: "briefcase",
    courses: 15,
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: "bullhorn",
    courses: 10,
  },
  {
    id: "language",
    name: "Language",
    icon: "language",
    courses: 7,
  },
  {
    id: "science",
    name: "Science",
    icon: "flask",
    courses: 9,
  },
];

export default function ExploreScreen() {
  const handleCategoryPress = (categoryId: string) => {
    router.push(`/explore/${categoryId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Courses</Text>
      <ScrollView style={styles.categoriesContainer}>
        {DUMMY_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(category.id)}
          >
            <View style={styles.categoryIcon}>
              <FontAwesome name={category.icon} size={24} color="#3860be" />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.courseCount}>{category.courses} courses</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#666" />
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
    padding: responsiveWidth(5),
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: responsiveHeight(2),
    color: "#000",
  },
  categoriesContainer: {
    flex: 1,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: responsiveWidth(4),
    borderRadius: 10,
    marginBottom: responsiveHeight(1.5),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8EEF9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsiveWidth(3),
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  courseCount: {
    fontSize: 14,
    color: "#666",
  },
});
