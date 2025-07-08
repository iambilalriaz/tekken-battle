'use client';
import axios from 'axios';
import { getAccessToken } from '@/lib/helpers';

const axiosClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Optional: set based on your auth requirements
});

// Add interceptor for injecting Authorization header
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    // Only add Authorization header if token exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const api = {
  get: async (url, config = {}) => {
    try {
      const response = await axiosClient.get(url, config);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  post: async (url, data = {}, config = {}) => {
    try {
      const response = await axiosClient.post(url, data, config);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  put: async (url, data = {}, config = {}) => {
    try {
      const response = await axiosClient.put(url, data, config);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await axiosClient.patch(url, data, config);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  delete: async (url, config = {}) => {
    try {
      const response = await axiosClient.delete(url, config);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

function handleError(error) {
  if (error.response) {
    const statusCode = error?.response?.status;

    console.log('API Error:', error.response.data);
    throw {
      errorCode: statusCode,
      errorMessage: error.response.data?.error || 'API Error',
    };
  } else if (error.request) {
    console.error('No response received from API:', error.request);
    throw new Error('No response from server.');
  } else {
    console.error('Error setting up API request:', error.message);
    throw new Error('Unexpected error.');
  }
}

export default api;
