import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/constants/app-routes';
import { useNetworkRequest } from '@/hooks/useNetworkRequest';
import { sendBattleRequestAPI } from '@/lib/pusher';
import { useAllUsers } from '@/store/useAllUsers';
import { useBattleRequests } from '@/store/useBattleRequests';
import { useSelectOpponentModal } from '@/store/useSelectOpponentModal';
import GlassyModal from '@/components/common/GlassyModal';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import Loader from '@/components/common/Loader';

const SelectYourOpponent = () => {
  const router = useRouter();
  const { showOpponentSelectionModal, toggleOpponentSelectionModal } =
    useSelectOpponentModal();

  const { allUsers } = useAllUsers();
  const { concatBattleRequest } = useBattleRequests();

  const {
    loading: sendingRequest,
    errorMessage: sendingRequestError,
    executeFunction: sendBattleRequest,
  } = useNetworkRequest({ apiFunction: sendBattleRequestAPI });
  const createBattleRequest = async (acceptorId) => {
    const response = await sendBattleRequest({
      acceptorId,
    });
    concatBattleRequest(response?.data);
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
      {sendingRequest ? (
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
