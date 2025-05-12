import axios from 'axios';
import { Lesson } from '../data/courses';
import { getAuthToken } from './auth';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.6:5000/api';

// Validate URL to prevent empty URI issues
if (!API_URL) {
  throw new Error('API URL is not configured');
}

const api = axios.create({
  baseURL: `${API_URL}/lessons`,
});

api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getLessonById = async (
  lessonId: string
): Promise<Lesson | null> => {
  try {
    const response = await api.get(`/${lessonId}`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch lesson');
    }
    const lesson = response.data;
    console.log('Fetched lesson data:', {
      id: lesson._id,
      title: lesson.title,
      content: lesson.content,
      duration: lesson.duration,
      videoUrl: lesson.videoUrl,
    });
    return {
      ...lesson,
      id: lesson._id,
    } as Lesson;
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return null;
  }
};

export const getLessonsByCourseId = async (
  courseId: string
): Promise<Lesson[]> => {
  try {
    const response = await api.get(`/course/${courseId}`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch course lessons');
    }
    const lessons = response.data.map((lesson: any) => ({
      ...lesson,
      id: lesson._id,
    }));
    return lessons as Lesson[];
  } catch (error) {
    console.error('Error fetching course lessons:', error);
    return [];
  }
};

export const updateLessonProgress = async (
  lessonId: string,
  progress: number
): Promise<boolean> => {
  try {
    const response = await api.post(`/${lessonId}/progress`, { progress });
    if (response.status !== 200) {
      throw new Error('Failed to update lesson progress');
    }
    return true;
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return false;
  }
};
