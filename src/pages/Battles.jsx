'use client';

import MainLayout from '@/layouts/MainLayout';
import { useEffect } from 'react';
import { useBattleRequests } from '@/store/useBattleRequests';
import GlassyCard from '@/components/common/GlassyCard';
import { useNetworkRequest } from '@/hooks/useNetworkRequest';
import { fetchAllUsersAPI, fetchYourBattleRequestsAPI } from '@/lib/api';
import Loader from '@/components/common/Loader';
import Battle from '@/components/Battle';
import toast from 'react-hot-toast';
import { useSelectOpponentModal } from '@/store/useSelectOpponentModal';
import { useAllUsers } from '@/store/useAllUsers';
import SelectYourOpponent from '@/components/SelectYourOpponent';
import Button from '@/components/common/Button';

const Battles = () => {
  const { battleRequests, setBattleRequests } = useBattleRequests();

  const { toggleOpponentSelectionModal } = useSelectOpponentModal();
  const { setAllUsers } = useAllUsers();

  const {
    loading: fetchingUsers,
    errorMessage: fetchingUsersError,
    executeFunction: fetchAllUsers,
  } = useNetworkRequest({
    apiFunction: fetchAllUsersAPI,
  });

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

  const {
    loading: fetchingBattleRequests,
    executeFunction: fetchBattleRequests,
  } = useNetworkRequest({
    apiFunction: fetchYourBattleRequestsAPI,
    initialLoader: true,
  });

  const fetchYourBattleRequests = async () => {
    const requests = await fetchBattleRequests();
    setBattleRequests(requests);
  };

  useEffect(() => {
    fetchYourBattleRequests();
  }, []);

  return (
    <MainLayout>
      <GlassyCard title='Battles List'>
        {fetchingBattleRequests ? (
          <div className='p-12'>
            <Loader size='lg' />
          </div>
        ) : battleRequests?.length ? (
          battleRequests?.map((request) => {
            return <Battle key={request?._id} battle={request} />;
          })
        ) : (
          <p className='p-4 text-center text-white'>
            No battles found. Ready to start your first fight?
          </p>
        )}
      </GlassyCard>
      <SelectYourOpponent />
      <div className='fixed px-2 right-0 w-full bottom-0 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-md py-2 flex justify-center items-center gap-2'>
        <Button
          variant='secondary'
          className='flex items-center justify-center gap-1 md:max-w-[240px] w-full py-4 uppercase !font-bold'
          onClick={fetchAllUsersRequest}
        >
          Challenge a Friend
        </Button>
      </div>
    </MainLayout>
  );
};

export default Battles;
