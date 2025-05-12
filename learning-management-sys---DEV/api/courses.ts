import axios from 'axios';
import { Course, Lesson } from '../data/courses';
import { getAuthToken } from './auth';

// const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.8.115:5000/api';
const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.6:5000/api';


// Validate URL to prevent empty URI issues
if (!API_URL) {
  throw new Error('API URL is not configured');
}

const api = axios.create({
  baseURL: `${API_URL}/courses`,
});

api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const response = await api.get('/');
    console.log('API Response:', response.data); // Debug log
    if (response.status !== 200) throw new Error('Failed to fetch courses');
    const courses = response.data.map((course: Course) => ({
      ...course,
     id: course._id,
    }));
    return courses as Course[];
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const getCourseById = async (id: string): Promise<Course> => {
  try {
    const response = await api.get(`/${id}`);
    if (response.status !== 200) throw new Error('Course not found');
    return { ...response.data, id: response.data._id } as Course;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const createCourse = async (courseData: Partial<Course>): Promise<Course> => {
  try {
    const response = await api.post('/', courseData);
    if (response.status !== 201) throw new Error('Failed to create course');
    return { ...response.data, id: response.data._id } as Course;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const updateCourse = async (id: string, courseData: Partial<Course>): Promise<boolean> => {
  try {
    const response = await api.put(`/${id}`, courseData);
    if (response.status !== 200) throw new Error('Failed to update course');
    return true;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const deleteCourse = async (id: string): Promise<boolean> => {
  try {
    const response = await api.delete(`/${id}`);
    if (response.status !== 200) throw new Error('Failed to delete course');
    return true;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const enrollInCourse = async (id: string): Promise<boolean> => {
  try {
    if (!id) throw new Error('Course ID is required');

    // First verify the course exists
    const course = await getCourseById(id).catch(() => null);
    if (!course) {
      throw new Error('Course not found or is no longer available');
    }

    const response = await api.post(`/${id}/enroll`, {}, {
      timeout: 10000, // 10 second timeout
      validateStatus: (status) => status === 200 || status === 400 // Accept 400 for validation errors
    }).catch(error => {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Connection timeout - please try again');
      }
      if (!error.response) {
        throw new Error('Network error - please check your connection');
      }
      if (error.response.status === 400) {
        throw new Error(error.response.data.message || 'Invalid enrollment request');
      }
      if (error.response.status === 500) {
        throw new Error('Server error - please try again later');
      }
      throw error;
    });

    if (!response || response.status !== 200) {
      throw new Error(response?.data?.message || 'Failed to enroll in course');
    }

    return true;
  } catch (error: any) {
    console.error('Enrollment API error:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || 'An unexpected error occurred during enrollment');
  }
};

export const unenrollFromCourse = async (id: string): Promise<boolean> => {
  try {
    const response = await api.post(`/${id}/unenroll`);
    if (response.status !== 200) throw new Error('Failed to unenroll from course');
    return true;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const addLesson = async (courseId: string, lessonData: Partial<Lesson>): Promise<boolean> => {
  try {
    const response = await api.post(`/${courseId}/lessons`, lessonData);
    if (response.status !== 200) throw new Error('Failed to add lesson');
    return true;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};