import api from '@/lib/axiosClient';

export const sendBattleRequestAPI = async (payload) => {
  const pusherSocketId = window?.Pusher?.instances?.[0]?.connection?.socket_id;

  try {
    const response = await api.post('/pusher/create-session', payload, {
      headers: {
        'Content-Type': 'aapplication/json',
        'X-Pusher-Socket-Id': pusherSocketId,
      },
    });
    return response;
  } catch (error) {
    throw new Error(error?.message);
  }
};
