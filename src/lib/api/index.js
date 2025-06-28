import api from '@/lib/axiosClient';

export const registerUserAPI = async (formData) => {
  try {
    const response = await api.post('/auth/signup', formData);
    return response;
  } catch (error) {
    throw new Error(error?.message);
  }
};
export const loginUserAPI = async (payload) => {
  try {
    const response = await api.post('/auth/login', payload);
    return response;
  } catch (error) {
    throw new Error(error?.message);
  }
};
export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    return response;
  } catch (error) {
    throw new Error(error?.message);
  }
};
export const uploadProfileImage = async (payload) => {
  try {
    const response = api.post('/upload-file', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw new Error(error?.message);
  }
};
export const logoutUserAPI = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response;
  } catch (error) {
    throw new Error(error?.message);
  }
};
export const fetchAllUsersAPI = async () => {
  try {
    const response = await api.get('/user/all');
    return response?.data;
  } catch (error) {
    throw new Error(error?.message);
  }
};
