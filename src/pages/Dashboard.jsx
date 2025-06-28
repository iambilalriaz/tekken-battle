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
            <divn className='grid place-items-center'>
              <p className='text-secondary text-2xl md:text-5xl font-semibold'>
                Welcome, {user.firstName} {user?.lastName}!
              </p>
              <div className='flex justify-center rounded-full overflow-hidden w-24 h-24 my-4'>
                <img src={user?.profileImage} width={100} height={100} />
              </div>
              <p className='mb-4'>Dashboard is under construction....</p>
              <Button onClick={onLogoutUser}>Logout</Button>
            </divn>
          )}
        </p>
      )}
    </MainLayout>
  );
};
export default Dashboard;
