import { useState } from 'react';
import { useLogoutCustomer } from '@/hooks/useLogoutCustomer';

export const useNetworkRequest = ({
  initialLoader = false,
  apiFunction,
  initialData = null,
}) => {
  const { logoutCustomer } = useLogoutCustomer();

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
        logoutCustomer();
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
