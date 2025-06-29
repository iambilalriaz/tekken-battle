'use client';

import OutlineButton from '@/components/common/OutlineButton';
import Loader from '@/components/common/Loader';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import MainLayout from '@/layouts/MainLayout';
import { useEffect } from 'react';
import { useNetworkRequest } from '@/hooks/useNetworkRequest';
import toast from 'react-hot-toast';
import { fetchAllUsersAPI } from '@/lib/api';
import { useAllUsers } from '@/store/useAllUsers';
import { useSelectOpponentModal } from '@/store/useSelectOpponentModal';
import SelectYourOpponent from '@/components/SelectYourOpponent';

const Dashboard = () => {
  const { loading, loggedIn } = useAuthStatus();
  const { toggleOpponentSelectionModal } = useSelectOpponentModal();
  const { setAllUsers } = useAllUsers();

  const {
    loading: fetchingUsers,
    errorMessage: fetchingUsersError,
    executeFunction: fetchAllUsers,
  } = useNetworkRequest({ apiFunction: fetchAllUsersAPI });

  const fetchAllUsersRequest = async () => {
    const response = await fetchAllUsers();
    setAllUsers(response);
    toggleOpponentSelectionModal();
  };

  useEffect(() => {
    if (fetchingUsersError) {
      toast.error(fetchingUsersError);
    }
  }, [fetchingUsersError]);
  return (
    <MainLayout>
      {loading ? (
        <Loader variant='secondary' />
      ) : (
        loggedIn && (
          <div className='text-center'>
            <p className='text-5xl md:text-7xl text-secondary font-semibold animate__animated animate__backInDown animate__delay-0.1s'>
              Hungry to Fight?
            </p>
            <p className='text-2xl md:text-3xl my-4 text-white animate__animated animate__backInDown animate__fast'>
              Create a session now!
            </p>
            {fetchingUsers ? (
              <Loader />
            ) : (
              <OutlineButton
                className='mt-4 animate__animated animate__backInDown animate__faster'
                onClick={fetchAllUsersRequest}
              >
                Create Session
              </OutlineButton>
            )}
            <SelectYourOpponent />
          </div>
        )
      )}
    </MainLayout>
  );
};
export default Dashboard;
