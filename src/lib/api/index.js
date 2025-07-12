import api from '@/lib/axiosClient';

export const registerUserAPI = async (formData) => {
  try {
    const response = await api.post('/auth/signup', formData);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const loginUserAPI = async (payload) => {
  try {
    const response = await api.post('/auth/login', payload);
    return response?.data;
  } catch (error) {
    throw error;
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
    throw error;
  }
};

export const fetchAllUsersAPI = async () => {
  try {
    const response = await api.get('/user/all');
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const fetchYourBattleRequestsAPI = async (status = '') => {
  try {
    const response = await api.get(
      `/battles/list${status ? `?status=${status}` : ''}`
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const respondToBattleRequestAPI = async (payload) => {
  try {
    const response = await api.patch('/battles/respond', payload);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const getBattleDetailsAPI = async (battleId) => {
  try {
    const response = await api.get(`/battles/${battleId}`);

    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const addNewMatchAPI = async (battleId, payload) => {
  try {
    const response = await api.post(`/battles/${battleId}/match/add`, payload);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const fetchBattleMatchesAPI = async (battleId) => {
  try {
    const response = await api.get(`/battles/${battleId}/match/list`);
    return response?.data;
  } catch (error) {
    throw error;
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
    throw error;
  }
};
export const fetchLoggedInUserAPI = async () => {
  try {
    const response = await api.get('/user');
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const updateLoggedInUserAPI = async (payload) => {
  try {
    const response = await api.patch('/user/update', payload);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const fetchHeadToHeadStatsAPI = async (opponentId) => {
  try {
    const response = await api.post('/stats/head-to-head', { opponentId });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
