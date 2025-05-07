import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ExpoRoot } from 'expo-router';

// Initialize Firebase early
import './config/firebase';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AuthProvider>
        <CourseProvider>
          <NotificationProvider>
            <ExpoRoot />
          </NotificationProvider>
        </CourseProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}