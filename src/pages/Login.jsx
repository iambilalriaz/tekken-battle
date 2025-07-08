'use client';
import Button from '@/components/common/Button';
import FloatingInput from '@/components/common/FloatingInput';
import GlassyCard from '@/components/common/GlassyCard';
import MainLayout from '@/layouts/MainLayout';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/constants/app-routes';
import { useForm } from 'react-hook-form';
import { emailRegex } from '@/constants';
import InputError from '@/components/common/InputError';
import Loader from '@/components/common/Loader';
import { loginUserAPI } from '@/lib/api';
import { useEffect } from 'react';
import { useNetworkRequest } from '@/hooks/useNetworkRequest';
import toast from 'react-hot-toast';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { saveAccessToken } from '@/lib/helpers';

const Login = () => {
  const router = useRouter();
  const { setLoggedInUser } = useLoggedInUser();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    loading,
    errorMessage,
    executeFunction: loginUser,
  } = useNetworkRequest({
    apiFunction: loginUserAPI,
  });

  const navigateToSignup = () => {
    router.push(APP_ROUTES.SIGNUP);
  };

  const onLoginUser = async (data) => {
    const { email, password } = data;
    const response = await loginUser({ email, password });
    setLoggedInUser(response?.user);
    saveAccessToken(response?.accessToken);

    reset();
    router.replace(APP_ROUTES.DASHBOARD);
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  return (
    <MainLayout>
      <GlassyCard title='Login'>
        <FloatingInput
          classes='mt-6'
          label='Email'
          type='email'
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: emailRegex,
              message: 'Enter a valid email',
            },
          })}
        />{' '}
        <InputError errorMessage={errors?.email?.message} />
        <FloatingInput
          classes='mt-6'
          label='Password'
          type='password'
          {...register('password', {
            required: 'Password is required',
          })}
        />{' '}
        <InputError errorMessage={errors?.password?.message} />
        <button className='underline cursor-pointer text-secondary mt-4 text-end w-full text-sm md:text-base'>
          Forgot Password?
        </button>
        <div className='my-4'>
          {loading ? (
            <Loader variant='secondary' />
          ) : (
            <Button
              className='mt-4 mx-auto w-full md:w-1/2 flex justify-center'
              onClick={handleSubmit(onLoginUser)}
            >
              Login
            </Button>
          )}
        </div>
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
