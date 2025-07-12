import toast from 'react-hot-toast';
import { useNetworkRequest } from '@/hooks/useNetworkRequest';
import { respondToBattleRequestAPI } from '@/lib/api';
import { useBattle } from '@/store/useBattle';
import BattleSummary from './BattleSummary';
import Button from './common/Button';
import GlassyModal from './common/GlassyModal';
import Loader from './common/Loader';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/constants/app-routes';

const FinishBattle = () => {
  const { battle, finishBattleModal, toggleFinishBattleModal } = useBattle();
  const router = useRouter();
  const {
    loading: responding,
    errorMessage: respondRequestError,
    executeFunction: respondToBattleRequest,
  } = useNetworkRequest({ apiFunction: respondToBattleRequestAPI });

  useEffect(() => {
    if (respondRequestError) {
      toast.error(respondRequestError);
    }
  }, [respondRequestError]);

  const finishBattle = async () => {
    await respondToBattleRequest({
      requestId: battle?._id,
      action: 'finish',
    });
    toggleFinishBattleModal();
    router.replace(APP_ROUTES.DASHBOARD);
  };
  return (
    <GlassyModal
      title='Battle Summary'
      isOpen={finishBattleModal}
      onClose={toggleFinishBattleModal}
    >
      <BattleSummary />
      <div className='flex justify-center'>
        {responding ? (
          <Loader />
        ) : (
          <Button
            variant='success'
            className='md:max-w-[240px] w-1/2 py-4 uppercase !font-bold'
            onClick={finishBattle}
          >
            Finish
          </Button>
        )}
      </div>
    </GlassyModal>
  );
};

export default FinishBattle;
