'use client';

import { useState } from 'react';
import { passwordRegex } from '@/constants';

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
  });

  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const checkPasswordRules = (password) => {
    setPasswordRules({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?#&]/.test(password),
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profileImage') {
      setForm({ ...form, profileImage: files[0] });
    } else {
      setForm({ ...form, [name]: value });
      if (name === 'password') checkPasswordRules(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!passwordRegex.test(form.password)) {
      setError(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
    } else {
      setSuccess('Signup successful!');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        profileImage: null,
      });
      setPasswordRules({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
      });
    }
  };

  return (
    <div className='max-w-md mx-auto mt-10 p-6 shadow-lg bg-white rounded-lg'>
      <h2 className='text-2xl font-bold mb-4 text-center'>Sign Up</h2>

      {error && <p className='text-red-500 mb-2'>{error}</p>}
      {success && <p className='text-green-600 mb-2'>{success}</p>}

      <form
        onSubmit={handleSubmit}
        encType='multipart/form-data'
        className='space-y-4'
      >
        <input
          type='text'
          name='firstName'
          placeholder='First Name'
          className='input input-bordered w-full'
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <input
          type='text'
          name='lastName'
          placeholder='Last Name'
          className='input input-bordered w-full'
          value={form.lastName}
          onChange={handleChange}
          required
        />
        <input
          type='email'
          name='email'
          placeholder='Email'
          className='input input-bordered w-full'
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          className='input input-bordered w-full'
          value={form.password}
          onChange={handleChange}
          required
        />
        {/* Password Policy UI */}
        <div className='text-sm bg-gray-50 p-3 rounded border mt-1'>
          <p className='font-medium mb-2'>Password must contain:</p>
          <ul className='list-disc list-inside space-y-1'>
            <li
              className={
                passwordRules.length ? 'text-green-600' : 'text-red-500'
              }
            >
              {passwordRules.length ? '✔' : '✖'} At least 8 characters
            </li>
            <li
              className={
                passwordRules.uppercase ? 'text-green-600' : 'text-red-500'
              }
            >
              {passwordRules.uppercase ? '✔' : '✖'} At least one uppercase
              letter
            </li>
            <li
              className={
                passwordRules.lowercase ? 'text-green-600' : 'text-red-500'
              }
            >
              {passwordRules.lowercase ? '✔' : '✖'} At least one lowercase
              letter
            </li>
            <li
              className={
                passwordRules.number ? 'text-green-600' : 'text-red-500'
              }
            >
              {passwordRules.number ? '✔' : '✖'} At least one digit
            </li>
            <li
              className={
                passwordRules.specialChar ? 'text-green-600' : 'text-red-500'
              }
            >
              {passwordRules.specialChar ? '✔' : '✖'} At least one special
              character
            </li>
          </ul>
        </div>

        <input
          type='password'
          name='confirmPassword'
          placeholder='Confirm Password'
          className='input input-bordered w-full'
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <input
          type='file'
          name='profileImage'
          accept='image/*'
          className='file-input file-input-bordered w-full'
          onChange={handleChange}
          required
        />
        <button type='submit' className='btn btn-primary w-full'>
          Sign Up
        </button>
      </form>
    </div>
  );
}
