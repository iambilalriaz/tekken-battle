import api from '@/lib/axiosClient';

export const registerUserAPI = async (formData) => {
  try {
    const response = await api.post('/auth/signup', formData);
    return response?.data;
  } catch (error) {
    throw new Error(error?.message);
  }
};
export const loginUserAPI = async (payload) => {
  try {
    const response = await api.post('/auth/login', payload);
    return response?.data;
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
export const fetchYourBattleRequestsAPI = async () => {
  try {
    const response = await api.get('/battle-request/list');
    return response?.data;
  } catch (error) {
    throw new Error(error?.message);
  }
};
export const respondToBattleRequestAPI = async (payload) => {
  try {
    const response = await api.patch('/battle-request/respond', payload);
    return response?.data;
  } catch (error) {
    throw new Error(error?.message);
  }
};
export const getBattleDetailsAPI = async (battleId) => {
  try {
    const response = await api.get(`/battle-request/${battleId}`);

    return response?.data;
  } catch (error) {
    throw new Error(error?.message);
  }
};
export const addNewMatchAPI = async (battleId, payload) => {
  try {
    const response = await api.post(
      `/battle-request/${battleId}/match/add`,
      payload
    );
    return response?.data;
  } catch (error) {
    throw new Error(error?.message);
  }
};
export const fetchBattleMatchesAPI = async (battleId) => {
  try {
    const response = await api.get(`/battle-request/${battleId}/match/list`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.message);
  }
};
