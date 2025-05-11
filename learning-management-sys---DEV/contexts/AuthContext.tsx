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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user and token on startup
  useEffect(() => {
    const checkStoredUser = async () => {
      try {
        const [storedUser, token] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('token')
        ]);

        if (storedUser && token) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error retrieving stored user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login({ email, password });
      
      if (response && response.success) {
        const { user: userData, token } = response;
        if (userData && token) {
          setUser(userData as User);
          await Promise.all([
            AsyncStorage.setItem('user', JSON.stringify(userData)),
            AsyncStorage.setItem('token', token)
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
    setUser(null);
    await Promise.all([
      AsyncStorage.removeItem('user'),
      AsyncStorage.removeItem('token')
    ]);
    router.replace('/login');
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
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