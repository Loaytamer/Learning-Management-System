import axios from 'axios';
import { Course, Lesson } from '../data/courses';
import { getAuthToken } from './auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.8.115:5000/api';

const api = axios.create({
  baseURL: `${API_URL}/courses`,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllCourses = async () => {
  const response = await api.get('/');
  return response.data;
};

export const getCourseById = async (id: string) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const createCourse = async (courseData: Partial<Course>) => {
  const response = await api.post('/', courseData);
  return response.data;
};

export const updateCourse = async (id: string, courseData: Partial<Course>) => {
  const response = await api.put(`/${id}`, courseData);
  return response.data;
};

export const deleteCourse = async (id: string) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

export const enrollInCourse = async (id: string) => {
  const response = await api.post(`/${id}/enroll`);
  return response.data;
};

export const unenrollFromCourse = async (id: string) => {
  const response = await api.post(`/${id}/unenroll`);
  return response.data;
};

export const addLesson = async (courseId: string, lessonData: Partial<Lesson>) => {
  const response = await api.post(`/${courseId}/lessons`, lessonData);
  return response.data;
};