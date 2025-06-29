import { useEffect } from 'react';
import { useIsSameUser } from '@/hooks/useIsSameUser';
import dayjs from '@/utils/dayjs';
import { useNetworkRequest } from '../hooks/useNetworkRequest';
import {
  fetchYourBattleRequestsAPI,
  respondToBattleRequestAPI,
} from '../lib/api';
import Loader from './common/Loader';
import toast from 'react-hot-toast';
import { useBattleRequests } from '../store/useBattleRequests';
import RequestStatus from './common/RequestStatus';
import RespondButtons from './RespondButtons';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '../constants/app-routes';

const DESCRIPTIONS = {
  requested: {
    requester: 'You have invited :playerName to play!',
    acceptor: ':playerName has invited you to play.',
  },
  'in-match': {
    requester: ':playerName accepted your challenge. ✅',
    acceptor: 'You accepted :playerName’s challenge. ✅',
  },
  rejected: {
    requester: ':playerName declined your challenge. ❌',
    acceptor: 'You rejected :playerName’s challenge. ❌',
  },
};

const BattleRequest = ({ battleRequest, closeModal = () => {} }) => {
  const { _id, acceptor, requester, status, createdAt } = battleRequest ?? {};
  const router = useRouter();
  const { setBattleRequests } = useBattleRequests();

  const { isSameUser } = useIsSameUser();

  const isMe = isSameUser(requester?.id);

  const timeAgo = dayjs(createdAt).fromNow();

  const getDescription = () => {
    const playerType = isMe ? 'requester' : 'acceptor';
    const playerName = !isMe
      ? requester?.name?.split(' ')?.[0]
      : acceptor?.name?.split(' ')?.[0];
    return DESCRIPTIONS[status][playerType]
      ?.replace(':playerName', playerName)
      ?.replace(':time', timeAgo);
  };

  const {
    loading: responding,
    errorMessage: respondRequestError,
    executeFunction: respondToBattleRequest,
  } = useNetworkRequest({ apiFunction: respondToBattleRequestAPI });

  const {
    loading: fetchingBattleRequests,
    errorMessage: fetchBattleRequestsError,
    executeFunction: fetchYourBattleRequests,
  } = useNetworkRequest({ apiFunction: fetchYourBattleRequestsAPI });

  const onRespondToBattleRequest = async (action = 'accept') => {
    await respondToBattleRequest({
      requestId: _id,
      action,
    });
    const response = await fetchYourBattleRequests();
    setBattleRequests(response);
    closeModal();
    if (action === 'accept') {
      router.push(APP_ROUTES.BATTLE.replace(':battleId', _id));
    }
  };

  useEffect(() => {
    if (respondRequestError) {
      toast.error(respondRequestError);
    }
  }, [respondRequestError]);
  useEffect(() => {
    if (fetchBattleRequestsError) {
      toast.error(fetchBattleRequestsError);
    }
  }, [fetchBattleRequestsError]);

  return (
    <div className='border-2 border-white p-4 my-4'>
      <div className='flex justify-end'>
        <RequestStatus status={status} />
      </div>
      <div className='flex  justify-center items-center p-6 gap-1'>
        <div className='w-24 h-24 sm:w-36 sm:h-36 border-white border-2 overflow-hidden rounded relative'>
          <img
            src={requester?.profileImage}
            className='w-full h-full object-cover'
            alt='Requester'
          />
          <p className='absolute text-primary font-bold left-0 right-0 bottom-0 text-center bg-secondary text-xs sm:text-base'>
            {requester?.name?.split(' ')?.[0]}
          </p>
        </div>
        <div className='justify-center items-center w-36 hidden sm:flex'>
          <img src='/vs.png' alt='VS' width={100} />
        </div>
        <img
          src='/vs.png'
          alt='VS'
          className='absolute z-10 w-24 sm:max-w-36 sm:hidden'
        />
        <div className='w-24 h-24 sm:w-36 sm:h-36 border-white border-2 overflow-hidden rounded relative'>
          <img
            src={acceptor?.profileImage}
            className='w-full h-full object-cover'
            alt='Acceptor'
          />
          <p className='absolute text-primary font-bold left-0 right-0 bottom-0 text-center bg-secondary text-xs sm:text-base'>
            {acceptor?.name?.split(' ')?.[0]}
          </p>
        </div>
      </div>
      <div>
        <p className='text-center my-4 font-semibold'>{getDescription()}</p>
      </div>
      <div>
        {responding || fetchingBattleRequests ? (
          <Loader />
        ) : isMe ? null : (
          status === 'requested' && (
            <RespondButtons
              config={{
                success: {
                  title: 'Accept',
                  handler: () => onRespondToBattleRequest('accept'),
                },
                cancel: {
                  title: 'Reject',
                  handler: () => onRespondToBattleRequest('reject'),
                },
              }}
            />
          )
        )}
      </div>
    </div>
  );
};

export default BattleRequest;
