'use client';
import Button from '@/components/Button';
import FloatingInput from '@/components/FloatingInput';
import GlassyCard from '@/components/GlassyCard';
import MainLayout from '@/layouts/MainLayout';
import { useForm } from 'react-hook-form';
import { emailRegex, passwordRegex } from '@/constants';
import InputError from '@/components/InputError';
import api from '@/lib/axiosClient';
import ImageUploadInput from '@/components/ImageUploadInput';

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    resetField,
    formState: { errors },
  } = useForm();

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

    const response = await api.post('/auth/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  return (
    <MainLayout>
      <GlassyCard title='Signup' styles='w-full md:w-1/2'>
        <FloatingInput
          inputClass='mt-3'
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
          inputClass='mt-3'
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
          inputClass='mt-3'
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
          inputClass='mt-3'
          name='password'
          label='Password'
          type='password'
          {...register('password', {
            required: 'Password is required',
            pattern: {
              value: passwordRegex,
              message: 'Must be 8+ chars, A-Z, 0-9, special',
            },
          })}
        />{' '}
        <InputError errorMessage={errors?.password?.message} />
        <FloatingInput
          inputClass='mt-3'
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
          inputClass='mt-3'
          {...register('profileImage', {
            required: 'Profile picture is required',
          })}
          watchedFile={watchedFile}
          removeSelectedFile={removeSelectedFile}
        />
        <InputError errorMessage={errors?.profileImage?.message} />
        <Button
          className='mt-4 mx-auto w-full md:w-1/2 flex justify-center'
          onClick={handleSubmit(onRegisterUser)}
        >
          Signup
        </Button>
      </GlassyCard>
    </MainLayout>
  );
};

export default Signup;
