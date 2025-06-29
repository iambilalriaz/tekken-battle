import { usePathname, useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/constants/app-routes';
import { useNetworkRequest } from '@/hooks/useNetworkRequest';
import { sendBattleRequestAPI } from '@/lib/pusher';
import { useAllUsers } from '@/store/useAllUsers';
import { useSelectOpponentModal } from '@/store/useSelectOpponentModal';
import GlassyModal from '@/components/common/GlassyModal';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import Loader from '@/components/common/Loader';
import { fetchYourBattleRequestsAPI } from '../lib/api';
import { useBattleRequests } from '../store/useBattleRequests';

const SelectYourOpponent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { showOpponentSelectionModal, toggleOpponentSelectionModal } =
    useSelectOpponentModal();

  const { setBattleRequests } = useBattleRequests();

  const { allUsers } = useAllUsers();

  const {
    loading: sendingRequest,
    errorMessage: sendingRequestError,
    executeFunction: sendBattleRequest,
  } = useNetworkRequest({ apiFunction: sendBattleRequestAPI });

  const {
    loading: fetchingBattleRequests,
    executeFunction: fetchBattleRequests,
  } = useNetworkRequest({
    apiFunction: fetchYourBattleRequestsAPI,
  });

  const createBattleRequest = async (acceptorId) => {
    await sendBattleRequest({
      acceptorId,
    });
    if (pathname === APP_ROUTES.BATTLE_REQUESTS) {
      const requests = await fetchBattleRequests();
      setBattleRequests(requests);
    }
    toggleOpponentSelectionModal();

    router.push(APP_ROUTES.BATTLE_REQUESTS);
  };

  useEffect(() => {
    if (sendingRequestError) {
      toast.error(sendingRequestError);
    }
  }, [sendingRequestError]);
  return (
    <GlassyModal
      isOpen={showOpponentSelectionModal}
      onClose={toggleOpponentSelectionModal}
      title='Select Your Opponent'
    >
      {sendingRequest || fetchingBattleRequests ? (
        <div className='p-12'>
          <p className='mb-4'>Creating session...</p>
          <Loader />
        </div>
      ) : (
        allUsers?.map((user) => (
          <div
            key={user?.userId}
            className='flex items-center hover:bg-gray/20 active:bg-gray/20 cursor-pointer p-2 select-none'
            onClick={() => createBattleRequest(user?.userId)}
          >
            <div className='w-10 h-10 rounded-full overflow-hidden border-4 border-white'>
              <img src={user?.profileImage} width={50} height={50} />
            </div>
            <p className='font-semibold ml-3'>{user?.name}</p>
          </div>
        ))
      )}
    </GlassyModal>
  );
};

export default SelectYourOpponent;
