import api from '@/lib/axiosClient';

export const registerUserAPI = async (formData) => {
  try {
    const response = await api.post('/auth/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw new Error(error?.message);
  }
};
export const loginUserAPI = async (payload) => {
  try {
    const response = await api.post('/auth/login', payload, {
      headers: {
        'Content-Type': 'aapplication/json',
      },
    });
    return response;
  } catch (error) {
    throw new Error(error?.message);
  }
};
export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/auth/me', {
      headers: {
        'Content-Type': 'aapplication/json',
      },
    });
    return response;
  } catch (error) {
    throw new Error(error?.message);
  }
};
export const logoutUserAPI = async () => {
  try {
    const response = await api.post('/auth/logout', {
      headers: {
        'Content-Type': 'aapplication/json',
      },
    });
    return response;
  } catch (error) {
    throw new Error(error?.message);
  }
};
