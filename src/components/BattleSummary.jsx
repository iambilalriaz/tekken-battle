'use client';

import { GiBroom } from 'react-icons/gi';
import PlayerImage from '@/components/matches/PlayerImage';
import { useBattleSummary } from '@/hooks/useBattleSummary';

const BattleSummary = () => {
  const { battleMatches, dominantId, dominant, summary } = useBattleSummary();
  if (!battleMatches || battleMatches.length === 0)
    return <p className='my-4'>No matches added.</p>;
  return (
    <div className='bg-glass p-6 rounded-2xl shadow-lg max-w-4xl mx-auto mt-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        {Object.values(summary).map((stat) => (
          <div
            key={stat.player._id}
            className={`rounded-xl p-4 relative bg-white/10 backdrop-blur border ${
              stat.player._id === dominantId
                ? 'border-yellow-400'
                : 'border-white/20'
            }`}
          >
            <div className='flex items-center gap-4 mb-4'>
              <PlayerImage
                player={stat.player}
                isWinner={stat.player._id === dominantId}
                displayName={false}
              />
              <h3 className='font-semibold'>
                {stat.player.firstName} {stat.player.lastName}
              </h3>
            </div>
            <ul className='text-sm space-y-1'>
              <li>
                🏆 Wins: <span className='font-bold'>{stat.wins}</span>
              </li>
              <li>
                💯 Perfect Rounds:{' '}
                <span className='font-bold'>{stat.perfects}</span>
              </li>
              <li>
                <GiBroom className='inline-block mb-1 mr-1 text-dodger-blue' />
                Clean Sweeps:{' '}
                <span className='font-bold'>{stat.cleanSweeps}</span>
              </li>
            </ul>
          </div>
        ))}
      </div>

      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-300'>
          Total Matches Played:{' '}
          <span className='font-semibold text-white'>
            {battleMatches.length}
          </span>
        </p>
        <p>
          Dominated by:{' '}
          <span className='mt-1 text-md text-secondary font-bold'>
            {dominant.player.firstName} {dominant.player.lastName}
          </span>
        </p>
      </div>
    </div>
  );
};

export default BattleSummary;
