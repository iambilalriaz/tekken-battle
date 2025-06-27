import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Optional: set based on your auth requirements
});

// Optional: Add interceptors
// axiosClient.interceptors.request.use(config => {
//   // Add auth token here if needed
//   return config;
// });

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
    console.error('API Error:', error.response.data);
    throw new Error(error.response.data?.message || 'API Error');
  } else if (error.request) {
    console.error('No response received from API:', error.request);
    throw new Error('No response from server.');
  } else {
    console.error('Error setting up API request:', error.message);
    throw new Error('Unexpected error.');
  }
}

export default api;
