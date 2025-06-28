'use client';
import Button from '@/components/Button';
import FloatingInput from '@/components/FloatingInput';
import GlassyCard from '@/components/GlassyCard';
import MainLayout from '@/layouts/MainLayout';
import { useForm } from 'react-hook-form';
import { emailRegex, passwordRegex } from '@/constants';
import InputError from '@/components/InputError';
import ImageUploadInput from '@/components/ImageUploadInput';
import { useNetworkRequest } from '@/hooks/useNetworkRequest';
import { registerUserAPI } from '@/lib/api';
import Loader from '@/components/Loader';

import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/constants/app-routes';

const Signup = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    resetField,
    reset,
    formState: { errors },
  } = useForm();

  const {
    loading,
    errorMessage,
    executeFunction: registerUser,
  } = useNetworkRequest({
    apiFunction: registerUserAPI,
  });

  const password = watch('password');

  const watchedFile = watch('profileImage')?.['0'];

  const removeSelectedFile = () => {
    resetField('profileImage');
  };

  const onRegisterUser = async (data) => {
    const { firstName, lastName, email, password, profileImage } = data;

    const formData = new FormData();

    const fields = {
      firstName,
      lastName,
      email,
      password,
    };

    Object.entries(fields).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (profileImage) {
      formData.append('profileImage', watchedFile);
    }
    await registerUser(formData);
    reset();
    router.replace(APP_ROUTES.DASHBOARD);
  };
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  const navigateToLogin = () => {
    router.push(APP_ROUTES.LOGIN);
  };
  return (
    <MainLayout>
      <GlassyCard title='Register User' styles='w-full md:w-1/2'>
        <FloatingInput
          classes='mt-3'
          name='firstName'
          label='First Name'
          {...register('firstName', {
            required: 'First name is required',
            minLength: {
              value: 3,
              message: 'Too short (min 3 chars)',
            },
          })}
        />
        <InputError errorMessage={errors?.firstName?.message} />
        <FloatingInput
          classes='mt-3'
          name='lastName'
          label='Last Name'
          {...register('lastName', {
            required: 'Last name is required',
            minLength: {
              value: 3,
              message: 'Too short (min 3 chars)',
            },
          })}
        />{' '}
        <InputError errorMessage={errors?.lastName?.message} />
        <FloatingInput
          classes='mt-3'
          name='email'
          label='Email'
          type='email'
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: emailRegex,
              message: 'Enter a valid email',
            },
          })}
        />
        <InputError errorMessage={errors?.email?.message} />
        <FloatingInput
          classes='mt-3'
          name='password'
          label='Password'
          type='password'
          {...register('password', {
            required: 'Password is required',
            pattern: {
              value: passwordRegex,
              message: 'Min 8 characters, A-Z, 0-9, special',
            },
          })}
        />{' '}
        <InputError errorMessage={errors?.password?.message} />
        <FloatingInput
          classes='mt-3'
          label='Confirm Password'
          type='password'
          name='confirmPassword'
          {...register('confirmPassword', {
            required: 'Confirm password is required',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />
        <InputError errorMessage={errors?.confirmPassword?.message} />
        <ImageUploadInput
          name='profileImage'
          label='Profile Picture'
          classes='mt-3'
          {...register('profileImage', {
            required: 'Profile picture is required',
          })}
          watchedFile={watchedFile}
          removeSelectedFile={removeSelectedFile}
        />
        <InputError errorMessage={errors?.profileImage?.message} />
        {loading ? (
          <div className='mt-8'>
            <Loader variant='secondary' />
          </div>
        ) : (
          <Button
            className='mt-8 mx-auto w-full md:w-1/2 flex justify-center'
            onClick={handleSubmit(onRegisterUser)}
          >
            Register
          </Button>
        )}
        <div className='text-sm md:text-base text-center mt-4'>
          <button
            className='underline cursor-pointer text-secondary'
            onClick={navigateToLogin}
          >
            Login Instead{' '}
          </button>
        </div>
      </GlassyCard>
    </MainLayout>
  );
};

export default Signup;
