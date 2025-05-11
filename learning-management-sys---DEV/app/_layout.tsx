import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { CourseProvider } from '../contexts/CourseContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { PaperProvider, MD3DarkTheme as DefaultTheme } from 'react-native-paper';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Define custom theme that extends the default dark theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200EE',
    secondary: '#03DAC6',
    error: '#CF6679',
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
  },
};

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <CourseProvider>
          <NotificationProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="course/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="lesson/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
            </Stack>
          </NotificationProvider>
        </CourseProvider>
      </AuthProvider>
    </PaperProvider>
  );
}