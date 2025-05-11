import axios from 'axios';
import { getAuthToken } from './auth';

// const API_URL = 'http://192.168.8.115:5000/api/auth';
// const API_URL = 'http://192.168.1.6:5000/api/auth'; // Loay

/**
 * Upload profile image to the server
 * @param formData The FormData object containing the profile image and any other data
 * @returns The response from the server with the updated user data
 */
export const uploadProfileImage = async (formData: FormData) => {
  try {
    // Get the auth token
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    // No need to create form data as it's now passed as a parameter

    // Send the request to the server
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error uploading profile image:', error);
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to upload image');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error('Error setting up the request');
    }
  }
};

/**
 * Delete the current profile image
 * @returns The response from the server with the updated user data
 */
export const deleteProfileImage = async () => {
  try {
    // Get the auth token
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    // Send the request to the server
    const response = await axios.delete(`${API_URL}/delete-image`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error deleting profile image:', error);
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to delete image');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error('Error setting up the request');
    }
  }
};