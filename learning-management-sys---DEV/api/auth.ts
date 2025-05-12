import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://192.168.8.115:5000/api/auth';
// const API_URL = 'http://192.168.1.6:5000/api/auth'; // Loay
const AUTH_TOKEN_KEY = 'auth_token';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  username: string;
  role?: 'student' | 'instructor';
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: 'student' | 'instructor';
    avatar?: string; // API returns avatar as a string (URL)
    enrolledCourses: string[];
    createdCourses: string[];
  };
}

export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

export const setAuthToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing auth token:', error);
  }
};

export const removeAuthToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
    if (response.data && response.data.token) {
      await setAuthToken(response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Authentication failed');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error('Error setting up the request');
    }
  }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/register`, data);
  if (response.data && response.data.token) {
    await setAuthToken(response.data.token);
  }
  return response.data;
};

export const logout = async (): Promise<void> => {
  await removeAuthToken();
  delete axios.defaults.headers.common['Authorization'];
};

export const getCurrentUser = async (token: string): Promise<AuthResponse['user']> => {
  const response = await axios.get<AuthResponse['user']>(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};