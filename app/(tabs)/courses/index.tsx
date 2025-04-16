import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CoursesIndexScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>All Courses</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F7F9",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
