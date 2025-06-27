'use client';
import Button from '@/components/Button';
import FloatingInput from '@/components/FloatingInput';
import GlassyCard from '@/components/GlassyCard';
import MainLayout from '@/layouts/MainLayout';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/constants/app-routes';

const Login = () => {
  const router = useRouter();
  const navigateToSignup = () => {
    router.push(APP_ROUTES.SIGNUP);
  };
  return (
    <MainLayout>
      <GlassyCard title='Login' styles='w-full md:w-1/2'>
        <FloatingInput inputClass='mt-6' label='Email' type='email' />
        <FloatingInput inputClass='mt-6' label='Password' type='password' />
        <button className='underline cursor-pointer text-secondary mt-4 text-end w-full text-sm md:text-base'>
          Forgot Password?
        </button>
        <Button className='mt-4 mx-auto w-full md:w-1/2 flex justify-center'>
          Login
        </Button>
        <div className='text-sm md:text-base text-center mt-4'>
          <p className='text-white'>Don't have an account?</p>
          <button
            className='underline cursor-pointer text-secondary'
            onClick={navigateToSignup}
          >
            Create New Account
          </button>
        </div>
      </GlassyCard>
    </MainLayout>
  );
};

export default Login;
