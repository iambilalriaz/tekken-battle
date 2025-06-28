import { useState } from 'react';

export const useNetworkRequest = ({ apiFunction, initialData = null }) => {
  const [loading, setLoading] = useState(false);
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
      const errorMessage = error?.message;
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
  };
};
