import axios from 'axios';
import { Course, Lesson } from '../data/courses';
import { getAuthToken } from './auth';

// const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.8.115:5000/api';
// const API_URL =process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.6:5000/api';
const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.43.250:5000/api';

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

export const getCourseById = async (id: string): Promise<Course | null> => {
  try {
    const response = await api.get(`/${id}`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch course');
    }
    const course = response.data;
    console.log('Fetched course data:', {
      id: course._id,
      title: course.title,
      instructor: course.instructor,
      instructorName: course.instructorName,
    });
    return {
      ...course,
      id: course._id,
    } as Course;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
};

export const createCourse = async (
  courseData: Partial<Course>
): Promise<Course> => {
  try {
    const response = await api.post('/', courseData);
    if (response.status !== 201) throw new Error('Failed to create course');

    // Log the response for debugging
    console.log('Course creation response:', response.data);

    // Convert MongoDB _id to id and ensure all required fields are present
    const newCourse = {
      ...response.data,
      id: response.data._id,
      lessons: response.data.lessons || [],
      enrolledStudents: response.data.enrolledStudents || [],
      rating: response.data.rating || 0,
      reviews: response.data.reviews || 0,
      createdAt: response.data.createdAt || new Date(),
      updatedAt: response.data.updatedAt || new Date(),
    };

    console.log('Processed new course:', newCourse);
    return newCourse as Course;
  } catch (error: any) {
    console.error('Course creation error:', error.response?.data || error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const updateCourse = async (
  id: string,
  courseData: Partial<Course>
): Promise<boolean> => {
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

    const response = await api
      .post(
        `/${id}/enroll`,
        {},
        {
          timeout: 10000, // 10 second timeout
          validateStatus: (status) => status === 200 || status === 400, // Accept 400 for validation errors
        }
      )
      .catch((error) => {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Connection timeout - please try again');
        }
        if (!error.response) {
          throw new Error('Network error - please check your connection');
        }
        if (error.response.status === 400) {
          throw new Error(
            error.response.data.message || 'Invalid enrollment request'
          );
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
    throw new Error(
      error.message || 'An unexpected error occurred during enrollment'
    );
  }
};

export const unenrollFromCourse = async (id: string): Promise<boolean> => {
  try {
    const response = await api.post(`/${id}/unenroll`);
    if (response.status !== 200)
      throw new Error('Failed to unenroll from course');
    return true;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const addLesson = async (
  courseId: string,
  lessonData: Partial<Lesson>
): Promise<boolean> => {
  try {
    console.log(`Adding lesson to course ${courseId}:`, lessonData);
    const response = await api.post(`/${courseId}/lessons`, lessonData);

    if (response.status === 200 || response.status === 201) {
      console.log('Lesson added successfully:', response.data);

      // Force a refresh of the course to ensure we have the latest data with the new lesson
      try {
        await getCourseById(courseId);
      } catch (refreshError) {
        console.warn(
          'Failed to refresh course after adding lesson:',
          refreshError
        );
        // Continue anyway since the lesson was added successfully
      }

      return true;
    } else {
      console.error('Unexpected response status:', response.status);
      throw new Error(
        `Failed to add lesson: Unexpected status ${response.status}`
      );
    }
  } catch (error: any) {
    console.error('Error in addLesson API call:', error);

    if (error.response) {
      console.error('Response error data:', error.response.data);
      if (error.response.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        `Failed to add lesson: ${error.response.status} ${error.response.statusText}`
      );
    }

    if (error.request) {
      console.error('No response received from server');
      throw new Error('Failed to add lesson: No response from server');
    }

    throw new Error(`Failed to add lesson: ${error.message}`);
  }
};
