import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { APP_ROUTES } from '../constants/app-routes';
import { deleteAccessToken } from '../lib/helpers';
import { useLoggedInUser } from './useLoggedInUser';

export const useNetworkRequest = ({
  initialLoader = false,
  apiFunction,
  initialData = null,
}) => {
  const router = useRouter();
  const { resetLoggedInUser } = useLoggedInUser();

  const [loading, setLoading] = useState(initialLoader);
  const [data, setData] = useState(initialData);
  const [error, setError] = useState('');
  const executeFunction = async (...params) => {
    setError('');
    setLoading(true);
    try {
      const response = await apiFunction(...params);
      setData(response);
      setError('');
      return response;
    } catch (error) {
      const errorMessage = error?.errorMessage;
      const errorCode = error?.errorCode;

      if (errorCode === 401) {
        deleteAccessToken();
        resetLoggedInUser();
        setTimeout(() => {
          router.replace(APP_ROUTES.LOGIN);
        }, 5000);
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    data,
    errorMessage: error,
    executeFunction,
    setErrorMessage: setError,
    setData,
  };
};
