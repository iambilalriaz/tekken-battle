'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import MainLayout from '@/layouts/MainLayout';
import { logoutUserAPI } from '@/lib/api';
import { APP_ROUTES } from '@/constants/app-routes';

const Dashboard = () => {
  const { loading, loggedIn, user } = useAuthStatus();
  const router = useRouter();
  const onLogoutUser = async () => {
    await logoutUserAPI();
    router.replace(APP_ROUTES.LOGIN);
  };

  return (
    <MainLayout>
      {loading ? (
        <Loader variant='secondary' />
      ) : (
        <p className='text-white text-xl text-center z-20 relative'>
          {loggedIn && (
            <>
              <p className='text-secondary text-2xl md:text-5xl font-semibold'>
                Welcome, {user.firstName} {user?.lastName}!
              </p>
              <p className='my-4'>Dashboard is under construction....</p>
              <Button onClick={onLogoutUser}>Logout</Button>
            </>
          )}
        </p>
      )}
    </MainLayout>
  );
};
export default Dashboard;
