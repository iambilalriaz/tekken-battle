'use client';

import { FaUserCircle } from 'react-icons/fa';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import MainLayout from '@/layouts/MainLayout';
import GlassyCard from '@/components/common/GlassyCard';
import PlayerImage from '@/components/matches/PlayerImage';
import SelectOpponent from '@/components/SelectOpponent';
import Loader from '@/components/common/Loader';

import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { useNetworkRequest } from '@/hooks/useNetworkRequest';
import { fetchHeadToHeadStatsAPI } from '@/lib/api';
import { useSelectOpponentModal } from '@/store/useSelectOpponentModal';
import StatsBox from '@/components/StatsBox';
import clsx from 'clsx';

const HeadToHeadStats = () => {
  const { loggedInUser } = useLoggedInUser();
  const { showOpponentSelectionModal, toggleOpponentSelectionModal } =
    useSelectOpponentModal();

  const {
    loading: fetchingStats,
    executeFunction: fetchHeadToHeadStats,
    data: stats,
    errorMessage,
  } = useNetworkRequest({ apiFunction: fetchHeadToHeadStatsAPI });

  useEffect(() => {
    if (errorMessage) toast.error(errorMessage);
  }, [errorMessage]);

  const fetchUserStats = async (opponentId) => {
    await fetchHeadToHeadStats(opponentId);
    toggleOpponentSelectionModal();
  };

  const { player1, player2, totalMatches, winnerId } = stats ?? {};

  return (
    <MainLayout>
      <GlassyCard title='Head to Head Stats'>
        <div className='grid grid-cols-3 place-items-center my-8'>
          <PlayerImage
            player={loggedInUser}
            imageDimensions={clsx(
              'w-20 h-20 md:w-32 md:h-32',
              stats ? '' : '!border-none'
            )}
            displayName={false}
            isWinner={winnerId && player1?.id === winnerId}
          />
          <img src='/vs.png' className='w-16 h-16 md:w-20 md:h-20' alt='vs' />
          {stats ? (
            <PlayerImage
              player={{ profileImageUrl: player2?.profileImage }}
              imageDimensions='w-20 h-20 md:w-32 md:h-32'
              displayName={false}
              isWinner={winnerId && player2?.id === winnerId}
            />
          ) : (
            <FaUserCircle className='w-20 h-20 md:w-32 md:h-32' />
          )}
        </div>

        {stats && (
          <>
            <p className='text-center my-4 uppercase font-bold'>
              Total matches played:{' '}
              <span className='text-secondary'>{totalMatches}</span>
            </p>
            <StatsBox
              statLabel='Wins'
              firstValue={player1?.winCount}
              secondValue={player2?.winCount}
            />
            <StatsBox
              statLabel='Perfects'
              firstValue={player1?.perfects}
              secondValue={player2?.perfects}
            />
            <StatsBox
              statLabel='Clean Sweeps'
              firstValue={player1?.cleanSweeps}
              secondValue={player2?.cleanSweeps}
            />
            <StatsBox
              statLabel='Win %'
              firstValue={player1?.winPercentage}
              secondValue={player2?.winPercentage}
            />
          </>
        )}

        <div
          className='uppercase flex items-center justify-center w-full h-12 border-2 border-dashed border-white rounded-xl cursor-pointer hover:border-secondary hover:text-secondary text-sm mt-4'
          onClick={toggleOpponentSelectionModal}
        >
          {stats ? 'Change opponent' : 'Choose an opponent'}
        </div>
      </GlassyCard>

      <SelectOpponent
        showModal={showOpponentSelectionModal}
        toggleModal={toggleOpponentSelectionModal}
        onSelectOpponent={fetchUserStats}
        loaderComponent={fetchingStats ? <Loader /> : null}
      />
    </MainLayout>
  );
};

export default HeadToHeadStats;
