'use client';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import MainLayout from '@/layouts/MainLayout';

const Homepage = () => {
  const router = useRouter();
  const navigateToLogin = () => {
    router.push('/login');
  };
  return (
    <MainLayout>
      <div className='text-center'>
        <p className='text-7xl text-secondary font-semibold animate__animated animate__backInDown animate__delay-0.1s'>
          Tekken Battle
        </p>
        <p className='text-3xl my-4 text-white animate__animated animate__backInDown animate__fast'>
          Let's Fight! 👊🏻
        </p>
        <Button
          className='mt-4 animate__animated animate__backInDown animate__faster'
          onClick={navigateToLogin}
        >
          Login
        </Button>
      </div>
    </MainLayout>
  );
};

export default Homepage;
