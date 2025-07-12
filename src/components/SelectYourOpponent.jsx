import { usePathname, useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/constants/app-routes';
import { useNetworkRequest } from '@/hooks/useNetworkRequest';
import { sendBattleRequestAPI } from '@/lib/pusher';
import { useSelectOpponentModal } from '@/store/useSelectOpponentModal';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import Loader from '@/components/common/Loader';
import { fetchYourBattleRequestsAPI } from '@/lib/api';
import { useBattleRequests } from '@/store/useBattleRequests';
import SelectOpponent from './SelectOpponent';

const SelectYourOpponent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { showOpponentSelectionModal, toggleOpponentSelectionModal } =
    useSelectOpponentModal();

  const { setBattleRequests } = useBattleRequests();

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
    if (pathname === APP_ROUTES.BATTLES.LIST) {
      const requests = await fetchBattleRequests();
      setBattleRequests(requests);
    }
    toggleOpponentSelectionModal();

    router.push(APP_ROUTES.BATTLES.LIST);
  };

  useEffect(() => {
    if (sendingRequestError) {
      toast.error(sendingRequestError);
    }
  }, [sendingRequestError]);
  return (
    <SelectOpponent
      showModal={showOpponentSelectionModal}
      toggleModal={toggleOpponentSelectionModal}
      loaderComponent={
        sendingRequest || fetchingBattleRequests ? (
          <div className='p-12'>
            <p className='mb-4'>Creating session...</p>
            <Loader />
          </div>
        ) : null
      }
      onSelectOpponent={createBattleRequest}
    />
  );
};

export default SelectYourOpponent;
