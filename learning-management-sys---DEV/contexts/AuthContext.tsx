import React, { createContext, useState, useContext, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../api/auth';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'instructor';
  avatar?: { uri: string };
  enrolledCourses: string[];
  createdCourses: string[];
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  updateUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Utility function to transform API avatar (string) to User avatar ({ uri: string })
const transformAvatar = (avatar?: string): { uri: string } | undefined => {
  return avatar ? { uri: avatar } : undefined;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user and token on startup
  useEffect(() => {
    const checkStoredUser = async () => {
      try {
        const [storedUser, token] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('token'),
        ]);

        console.log("Startup - Stored user:", storedUser, "Token:", token); // Debug log

        if (storedUser && token) {
          const userData = JSON.parse(storedUser) as User;
          setUser(userData); // Use the stored user data (including avatar) directly
          console.log("Startup - Loaded user with avatar from storage:", userData.avatar);

          // Optionally sync with backend to ensure token is still valid
          try {
            const updatedUser = await authApi.getCurrentUser(token);
            if (updatedUser) {
              const fullUserData: User = {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: transformAvatar(updatedUser.avatar) ?? userData.avatar, // Prefer stored avatar if API doesn't return one
                enrolledCourses: updatedUser.enrolledCourses || userData.enrolledCourses,
                createdCourses: updatedUser.createdCourses || userData.createdCourses,
              };
              console.log("Startup - Synced user with avatar from API:", fullUserData.avatar);
              setUser(fullUserData);
              await AsyncStorage.setItem('user', JSON.stringify(fullUserData));
            }
          } catch (apiError) {
            console.error("Startup - Failed to sync with API, using stored data:", apiError);
            // Continue using stored user data if API sync fails
          }
        } else {
          console.log("Startup - No stored user or token");
        }
      } catch (error) {
        console.error('Error retrieving stored user:', error);
        await Promise.all([
          AsyncStorage.removeItem('user'),
          AsyncStorage.removeItem('token'),
        ]);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login({ email, password });

      console.log("Login - API response (login):", response); // Debug log

      if (response && response.success) {
        const { user: userData, token } = response;
        if (userData && token) {
          const updatedUser = await authApi.getCurrentUser(token);
          console.log("Login - API response (getCurrentUser):", updatedUser); // Debug log

          const avatarFromLogin = transformAvatar(userData.avatar);
          const avatarFromGetCurrentUser = transformAvatar(updatedUser.avatar);

          const fullUserData: User = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            role: userData.role as 'student' | 'instructor',
            avatar: avatarFromGetCurrentUser || avatarFromLogin, // Prioritize getCurrentUser, fallback to login response
            enrolledCourses: updatedUser.enrolledCourses || userData.enrolledCourses || [],
            createdCourses: updatedUser.createdCourses || userData.createdCourses || [],
          };
          console.log("Login - Setting user with avatar:", fullUserData.avatar); // Debug log
          setUser(fullUserData);
          await Promise.all([
            AsyncStorage.setItem('user', JSON.stringify(fullUserData)),
            AsyncStorage.setItem('token', token),
          ]);
          return true;
        }
      }
      return false;
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      console.error('Login error:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    console.log("Logout - Clearing user and token"); // Debug log
    setUser(null);
    await Promise.all([
      AsyncStorage.removeItem('user'),
      AsyncStorage.removeItem('token'),
    ]);
    router.replace('/login');
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      console.log("UpdateUser - Updated user with avatar:", updatedUser.avatar); // Debug log
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};