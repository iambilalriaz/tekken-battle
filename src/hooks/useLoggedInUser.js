'use client';
import { useSignedInUser } from '@/store/useSignedInUser';

export const useLoggedInUser = () => {
  const { loggedInUser, setLoggedInUser, resetLoggedInUser } =
    useSignedInUser();
  const user =
    typeof localStorage !== 'undefined'
      ? JSON.parse(localStorage.getItem('loggedInUser') || 'null')
      : null;

  return {
    loggedInUser: loggedInUser || user,
    setLoggedInUser,
    resetLoggedInUser,
  };
};
