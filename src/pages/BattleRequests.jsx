'use client';

import MainLayout from '@/layouts/MainLayout';
import Pusher from 'pusher-js';

import { useEffect } from 'react';

import { useBattleRequests } from '@/store/useBattleRequests';
import GlassyCard from '@/components/common/GlassyCard';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { useNetworkRequest } from '../hooks/useNetworkRequest';
import { fetchAllUsersAPI, fetchYourBattleRequestsAPI } from '../lib/api';
import Loader from '../components/common/Loader';
import BattleRequest from '../components/BattleRequest';
import toast from 'react-hot-toast';
import { useSelectOpponentModal } from '../store/useSelectOpponentModal';
import { useAllUsers } from '../store/useAllUsers';
import SelectYourOpponent from '../components/SelectYourOpponent';
import OutlineButton from '../components/common/OutlineButton';
import { APP_ROUTES } from '../constants/app-routes';
import { useRouter } from 'next/navigation';

const BattleRequests = () => {
  const { loggedInUser } = useLoggedInUser();
  const router = useRouter();
  const { battleRequests, concatBattleRequest, setBattleRequests } =
    useBattleRequests();

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

  const {
    loading: fetchingBattleRequests,
    executeFunction: fetchBattleRequests,
  } = useNetworkRequest({
    apiFunction: fetchYourBattleRequestsAPI,
  });

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: '/api/pusher/auth', // ✅ Required for private channels
      auth: {
        withCredentials: true, // ✅ Important for cookie-based auth
      },
    });

    const channel = pusher.subscribe(`private-user-${loggedInUser?.id}`);
    channel.bind('battle-request-received', (response) => {
      concatBattleRequest(response);
    });
    channel.bind('battle-request-updated', (response) => {
      const battledId = response?._id;
      const updatedBattleRequests = battleRequests?.map((request) => {
        if (request?._id === battledId) {
          return { ...request, status: response?.status };
        }
        return request;
      });
      setBattleRequests(updatedBattleRequests);

      if (response?.status === 'in-match') {
        router.push(APP_ROUTES.BATTLE?.replace(':battleId', battledId));
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [loggedInUser?.id, JSON.stringify(battleRequests)]);

  const fetchYourBattleRequests = async () => {
    const requests = await fetchBattleRequests();
    setBattleRequests(requests);
  };

  useEffect(() => {
    fetchYourBattleRequests();
  }, []);

  return (
    <MainLayout>
      <GlassyCard title='Battle Requests'>
        {fetchingBattleRequests || fetchingUsers ? (
          <div className='p-12'>
            <Loader size='lg' />
          </div>
        ) : battleRequests?.length ? (
          battleRequests?.map((request) => {
            return <BattleRequest key={request?._id} battleRequest={request} />;
          })
        ) : (
          <div className='p-4 text-center'>
            <p className='text-white'>No requests found. Let's create now!</p>
            <OutlineButton className='mt-4' onClick={fetchAllUsersRequest}>
              {' '}
              Create
            </OutlineButton>
          </div>
        )}
      </GlassyCard>
      <SelectYourOpponent />
    </MainLayout>
  );
};

export default BattleRequests;
