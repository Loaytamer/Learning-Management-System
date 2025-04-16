import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="explore"
      screenOptions={{
        tabBarActiveTintColor: "#3860be",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          height: Platform.OS === "ios" ? 90 : 65,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          paddingTop: 10,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#eee",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Courses",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="book" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="cog" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: "My Courses",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="graduation-cap" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
