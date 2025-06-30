import { useLoggedInUser } from '@/hooks/useLoggedInUser';

export const useIsSameUser = () => {
  const { loggedInUser } = useLoggedInUser();
  const isSameUser = (userId) => userId === loggedInUser?.id;
  return { isSameUser };
};
