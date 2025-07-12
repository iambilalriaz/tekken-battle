'use client';
import { useRouter } from 'next/navigation';
import { deleteAccessToken } from '@/lib/helpers';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { APP_ROUTES } from '@/constants/app-routes';

export const useLogoutCustomer = () => {
  const { resetLoggedInUser } = useLoggedInUser();
  const router = useRouter();
  const logoutCustomer = () => {
    deleteAccessToken();
    resetLoggedInUser();
    setTimeout(() => {
      router.push(APP_ROUTES.LOGIN);
    }, 500);
  };

  return { logoutCustomer };
};
