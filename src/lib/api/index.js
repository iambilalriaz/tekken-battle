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
export const fetchYourBattleRequestsAPI = async (status = '') => {
  try {
    const response = await api.get(
      `/battles/list${status ? `?status=${status}` : ''}`
    );
    return response?.data;
  } catch (error) {
    throw new Error(error?.message);
  }
};
export const respondToBattleRequestAPI = async (payload) => {
  try {
    const response = await api.patch('/battles/respond', payload);
    return response?.data;
  } catch (error) {
    throw new Error(error?.message);
  }
};
export const getBattleDetailsAPI = async (battleId) => {
  try {
    const response = await api.get(`/battles/${battleId}`);

    return response?.data;
  } catch (error) {
    throw new Error(error?.message);
  }
};
export const addNewMatchAPI = async (battleId, payload) => {
  try {
    const response = await api.post(`/battles/${battleId}/match/add`, payload);
    return response?.data;
  } catch (error) {
    throw new Error(error?.message);
  }
};
export const fetchBattleMatchesAPI = async (battleId) => {
  try {
    const response = await api.get(`/battles/${battleId}/match/list`);
    return response?.data;
  } catch (error) {
    throw new Error(error?.message);
  }
};
export const fetchDashboardDataAPI = async ({ date, opponentId }) => {
  try {
    const response = await api.post('/dashboard', {
      date,
      opponentId,
    });
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};
export const fetchLoggedInUserAPI = async () => {
  try {
    const response = await api.get('/user');
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};
export const updateLoggedInUserAPI = async (payload) => {
  try {
    const response = await api.patch('/user/update', payload);
    return response?.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};
