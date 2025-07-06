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
import Button from './common/Button';
import PlayerCard from './matches/PlayerCard';
import { BATTLE_STATUSES } from '../constants';

const DESCRIPTIONS = {
  [BATTLE_STATUSES.REQUESTED]: {
    requester: 'You have invited :playerName to play!',
    acceptor: ':playerName has invited you to play.',
  },
  [BATTLE_STATUSES.IN_MATCH]: {
    requester: ':playerName accepted your challenge. ✅',
    acceptor: 'You accepted :playerName’s challenge. ✅',
  },
  [BATTLE_STATUSES.REJECTED]: {
    requester: ':playerName declined your challenge. ❌',
    acceptor: 'You rejected :playerName’s challenge. ❌',
  },
  [BATTLE_STATUSES.FINISHED]: {
    requester: '',
    acceptor: '',
  },
};

const Battle = ({ battle, closeModal = () => {} }) => {
  const { _id, acceptor, requester, status, createdAt } = battle ?? {};
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
  } = useNetworkRequest({
    apiFunction: fetchYourBattleRequestsAPI,
  });

  const onRespondToBattleRequest = async (action = 'accept') => {
    await respondToBattleRequest({
      requestId: _id,
      action,
    });
    const response = await fetchYourBattleRequests();
    setBattleRequests(response);
    closeModal();
    if (action === 'accept') {
      router.push(APP_ROUTES.BATTLES.RECORD.replace(':battleId', _id));
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

  const navigateToBattleDetails = () => {
    if (status === BATTLE_STATUSES.IN_MATCH) {
      router.push(APP_ROUTES.BATTLES.RECORD.replace(':battleId', battle?._id));
    }
  };

  const player1 = {
    firstName: requester?.name?.split(' ')?.[0],
    profileImageUrl: requester?.profileImage,
  };
  const player2 = {
    firstName: acceptor?.name?.split(' ')?.[0],
    profileImageUrl: acceptor?.profileImage,
  };
  return (
    <div className='border border-white p-4 my-4 animate__animated animate__rollIn'>
      <div className='flex justify-end'>
        <RequestStatus status={status} />
      </div>

      <div className='flex items-center flex-row max-[380px]:flex-col justify-between gap-2 md:gap-6 w-full mt-4 px-2 md:p-6'>
        <PlayerCard player={player1} isBattleDetails />
        <div>
          <img src='/vs.png' alt='VS' width={100} />
        </div>
        <PlayerCard player={player2} isBattleDetails />
      </div>
      <div>
        <p className='text-center my-4 font-semibold'>{getDescription()}</p>
      </div>
      <div>
        {responding || fetchingBattleRequests ? (
          <Loader />
        ) : status === BATTLE_STATUSES.REQUESTED ? (
          isMe ? null : (
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
        ) : (
          status !== BATTLE_STATUSES.REJECTED && (
            <div className='flex justify-center'>
              <Button variant='dodger-blue' onClick={navigateToBattleDetails}>
                Details
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Battle;
