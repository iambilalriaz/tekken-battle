import { useAuthStatus } from '@/hooks/useAuthStatus';

export const useIsSameUser = () => {
  const { user } = useAuthStatus();
  const isSameUser = (userId) => userId === user?.userId;
  return { isSameUser };
};
