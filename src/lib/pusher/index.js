import api from '@/lib/axiosClient';

export const sendBattleRequestAPI = async (payload) => {
  try {
    const response = await api.post('/pusher/create-session', payload, {
      headers: {
        'Content-Type': 'aapplication/json',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
