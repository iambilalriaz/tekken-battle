'use client';
import { useRouter } from 'next/navigation';
import OutlineButton from '@/components/common/OutlineButton';
import MainLayout from '@/layouts/MainLayout';
import { APP_ROUTES } from '@/constants/app-routes';

const Homepage = () => {
  const router = useRouter();
  const navigateToDashoard = () => {
    router.push(APP_ROUTES.DASHBOARD);
  };
  return (
    <MainLayout>
      <div className='text-center'>
        <p className='text-5xl md:text-7xl text-secondary font-semibold animate__animated animate__backInDown animate__delay-0.1s'>
          Tekken Battle
        </p>
        <p className='text-2xl md:text-3xl my-4 text-white animate__animated animate__backInDown animate__fast'>
          Let's Fight! 🤼‍♂️
        </p>
        <OutlineButton
          className='mt-4 animate__animated animate__backInDown animate__faster'
          onClick={navigateToDashoard}
        >
          Fight
        </OutlineButton>
      </div>
    </MainLayout>
  );
};

export default Homepage;
