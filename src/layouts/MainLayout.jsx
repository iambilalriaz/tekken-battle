'use client';
import Navbar from '@/components/common/Navbar';
import PendingRequests from '@/components/PendingRequests';
import Pusher from 'pusher-js';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { useEffect, useState } from 'react';
import { useBattleRequests } from '@/store/useBattleRequests';
import { BATTLE_STATUSES } from '@/constants';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/constants/app-routes';
import toast from 'react-hot-toast';
import { fetchYourBattleRequestsAPI } from '@/lib/api';
import { useNetworkRequest } from '@/hooks/useNetworkRequest';

const MainLayout = ({ children }) => {
  const { loggedInUser } = useLoggedInUser();
  const { battleRequests, setBattleRequests } = useBattleRequests();
  const [invited, setInvited] = useState(false);
  const [pendingInvites, setPendingInvites] = useState([]);

  const {
    errorMessage: fetchBattleRequestsError,
    executeFunction: fetchYourBattleRequests,
  } = useNetworkRequest({
    apiFunction: fetchYourBattleRequestsAPI,
  });
  const router = useRouter();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: '/api/pusher/auth', // ✅ Required for private channels
      auth: {
        withCredentials: true, // ✅ Important for cookie-based auth
      },
    });

    const channel = pusher.subscribe(`private-user-${loggedInUser?.id}`);
    channel.bind('battle-request-received', async (response) => {
      setInvited(true);
      const data = await fetchYourBattleRequests(BATTLE_STATUSES.REQUESTED);
      setPendingInvites(data);
      setBattleRequests(data);
    });
    channel.bind('battle-request-updated', async (response) => {
      const data = await fetchYourBattleRequests(BATTLE_STATUSES.REQUESTED);
      setPendingInvites(data);
      setBattleRequests(data);
      if (response?.status === BATTLE_STATUSES.FINISHED) {
        router.replace(APP_ROUTES.DASHBOARD);
      } else if (response?.status === BATTLE_STATUSES.IN_MATCH) {
        router.push(
          APP_ROUTES.BATTLES.RECORD.replace(':battleId', response?._id)
        );
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [loggedInUser?.id, , JSON.stringify(battleRequests)]);
  const onCloseModal = () => {
    setInvited(false);
  };

  useEffect(() => {
    if (fetchBattleRequestsError) {
      toast.error(fetchBattleRequestsError);
    }
  }, [fetchBattleRequestsError]);
  return (
    <main className='grid place-items-center h-screen mx-4'>
      <Navbar />
      <div className='w-full grid place-items-center max-h-full overflow-auto py-16'>
        {children}
      </div>
      <PendingRequests
        isOpen={invited}
        data={pendingInvites}
        onClose={onCloseModal}
      />
    </main>
  );
};

export default MainLayout;
