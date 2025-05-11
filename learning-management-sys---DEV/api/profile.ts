import axios from 'axios';
import { getAuthToken } from './auth';

// const API_URL = 'http://192.168.8.115:5000/api/auth';
const API_URL = 'http://192.168.1.6:5000/api/auth'; // Loay

/**
 * Upload profile image to the server
 * @param imageUri The local URI of the image to upload
 * @returns The response from the server with the updated user data
 */
export const uploadProfileImage = async (imageUri: string) => {
  try {
    // Get the auth token
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    // Create form data for the image upload
    const formData = new FormData();

    // Get the filename from the URI
    const uriParts = imageUri.split('/');
    const fileName = uriParts[uriParts.length - 1];

    // Append the image to the form data
    formData.append('profileImage', {
      uri: imageUri,
      name: fileName,
      type: 'image/jpeg', // Assuming JPEG format, adjust if needed
    } as any);

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
