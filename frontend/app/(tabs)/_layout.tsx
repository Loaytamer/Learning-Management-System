import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import CustomTabBar from '../../components/layout/CustomTabBar';

export default function TabLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const isInstructor = user?.role === 'instructor';

  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: '#9CA3AF'
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home'
        }} 
      />
      <Tabs.Screen 
        name="courses" 
        options={{ 
          title: 'Courses'
        }} 
      />
      <Tabs.Screen 
        name="create" 
        options={{ 
          title: 'Create',
          href: isInstructor ? null : null
        }} 
      />
      <Tabs.Screen 
        name="notifications" 
        options={{ 
          title: 'Notifications'
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile'
        }} 
      />
    </Tabs>
  );
}