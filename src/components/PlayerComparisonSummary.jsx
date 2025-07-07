'use client';

import { GiBroom } from 'react-icons/gi';
import PlayerImage from '@/components/matches/PlayerImage';
import { useDashboardStats } from '@/store/useDashboardStats';
import dayjs from 'dayjs';

const PlayerComparisonSummary = ({ data, currentUser }) => {
  const { statsDate } = useDashboardStats();

  if (!data || !currentUser) return null;

  const { totalMatches, isDraw, winner, loser } = data;

  const players = [
    {
      id: winner.name === 'You' ? currentUser.id : 'opponent',
      ...winner,
      isWinner: !isDraw,
    },
    {
      id: loser.name === 'You' ? currentUser.id : 'opponent',
      ...loser,
      isWinner: false,
    },
  ];

  // Winner name display logic
  const headline = isDraw
    ? `It was a draw on ${dayjs(statsDate).format('DD MMM, YYYY')}`
    : `${winner.name} dominated on ${dayjs(statsDate).format('DD MMM, YYYY')}`;

  return (
    <div className='mx-4 pb-20'>
      <div className='flex justify-center gap-1 my-6 text-3xl md:text-5xl'>
        <p>🏆</p>
        <div>
          <h1 className='font-bold'>{headline}</h1>

          <div className='text-white/80'>
            {/* Desktop View */}
            <h3 className='text-xl mt-4 hidden md:block'>
              {totalMatches} matches played —{' '}
              {!isDraw && `${winner.winPercentage}% win rate`}
            </h3>

            {/* Mobile View */}
            <div className='block md:hidden text-lg mt-4 font-semibold space-y-1'>
              <h3>— {totalMatches} matches played</h3>
              {!isDraw && <h3>— {winner.winPercentage}% win rate</h3>}
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 md:max-w-3/4 mx-auto'>
        {players.map((p) => (
          <div
            key={p.id}
            className='rounded-xl p-6 relative bg-black/20 backdrop-blur border border-white/30'
          >
            <div className='flex items-center gap-4 mb-4'>
              <PlayerImage
                player={{ profileImageUrl: p.profileImage }}
                isWinner={p.isWinner}
                displayName={false}
              />
              <h3 className='text-2xl font-semibold text-center'>{p.name}</h3>
            </div>

            <ul className='text-sm space-y-1'>
              <li>
                🏆 Wins: <span className='font-bold'>{p.winCount}</span>
              </li>
              <li>
                💯 Perfect Rounds:{' '}
                <span className='font-bold'>{p.perfects}</span>
              </li>
              <li>
                <GiBroom className='inline-block mb-1 mr-1 text-dodger-blue' />{' '}
                Clean Sweeps: <span className='font-bold'>{p.cleanSweeps}</span>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerComparisonSummary;
