'use client';
import Navbar from '@/components/common/Navbar';
import PendingRequests from '@/components/PendingRequests';
import Pusher from 'pusher-js';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { useEffect, useState } from 'react';
import { useBattleRequests } from '@/store/useBattleRequests';
import { BATTLE_STATUSES, NON_AUTHORIZED_PAGES } from '@/constants';
import { usePathname, useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/constants/app-routes';
import toast from 'react-hot-toast';
import { fetchYourBattleRequestsAPI } from '@/lib/api';
import { useNetworkRequest } from '@/hooks/useNetworkRequest';
import { getAccessToken } from '@/lib/helpers';
import { useLogoutCustomer } from '@/hooks/useLogoutCustomer';

const MainLayout = ({ children }) => {
  const { loggedInUser } = useLoggedInUser();
  const { logoutCustomer } = useLogoutCustomer();

  const pathname = usePathname();
  const accessToken = getAccessToken();
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

  const playNotification = () => {
    const audio = new Audio('/knock.mp3');
    audio.play();
  };

  useEffect(() => {
    if (accessToken) {
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
        authEndpoint: '/api/pusher/auth', // ✅ Required for private channels
        auth: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      });

      const channel = pusher.subscribe(`private-user-${loggedInUser?.id}`);
      channel.bind('battle-request-received', async () => {
        setInvited(true);
        playNotification();
        const data = await fetchYourBattleRequests(BATTLE_STATUSES.REQUESTED);
        setPendingInvites(data);
        setBattleRequests(data);
      });
      channel.bind('battle-request-updated', async (response) => {
        const data = await fetchYourBattleRequests(BATTLE_STATUSES.REQUESTED);
        setPendingInvites(data);
        setBattleRequests(data);

        if (response?.status === BATTLE_STATUSES.REJECTED) {
          toast.error('Your match request has been rejected.');
          return;
        }
        if (response?.status === BATTLE_STATUSES.FINISHED) {
          router.replace(APP_ROUTES.DASHBOARD);
          return;
        }
        if (response?.status === BATTLE_STATUSES.IN_MATCH) {
          router.push(
            APP_ROUTES.BATTLES.RECORD.replace(':battleId', response?._id)
          );
          return;
        }
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
        pusher.disconnect();
      };
    } else if (!NON_AUTHORIZED_PAGES?.includes(pathname)) {
      logoutCustomer();
    }
  }, [
    JSON.stringify(loggedInUser),
    accessToken,
    JSON.stringify(battleRequests),
    pathname,
  ]);
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
