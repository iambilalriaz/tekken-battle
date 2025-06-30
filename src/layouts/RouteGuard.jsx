'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { APP_ROUTES } from '@/constants/app-routes';

const publicAuthPages = [APP_ROUTES.LOGIN, APP_ROUTES.SIGNUP];
const dashboardRedirect = APP_ROUTES.DASHBOARD;
const loginRedirect = APP_ROUTES.LOGIN;

const RouteGuard = ({ children }) => {
  const { loggedInUser } = useLoggedInUser();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isAuthPage = publicAuthPages.includes(pathname);
    if (loggedInUser && isAuthPage) {
      router.replace(dashboardRedirect);
    } else if (!loggedInUser && !isAuthPage) {
      router.replace(loginRedirect);
    }
  }, [pathname, JSON.stringify(loggedInUser), router]);

  return children;
};

export default RouteGuard;
