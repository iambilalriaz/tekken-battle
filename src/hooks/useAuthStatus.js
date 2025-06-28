'use client';
import { useEffect, useState } from 'react';
import { fetchUserProfile } from '@/lib/api';
export const useAuthStatus = () => {
  const [auth, setAuth] = useState({
    loading: true,
    loggedIn: false,
    user: null,
  });
  const checkAuth = async () => {
    try {
      const data = await fetchUserProfile();

      setAuth({
        loading: false,
        loggedIn: data.loggedIn,
        user: data.user || null,
      });
    } catch (err) {
      setAuth({ loading: false, loggedIn: false, user: null });
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  return auth;
};
