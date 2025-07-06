'use client';

import { FaCrown } from 'react-icons/fa6';
import { GiBroom } from 'react-icons/gi';
import { useBattleMatches } from '../store/useBattleMatches';
import PlayerCard from './matches/PlayerCard';
import PlayerImage from './matches/PlayerImage';

const BattleSummary = () => {
  const { battleMatches } = useBattleMatches();

  if (!battleMatches || battleMatches.length === 0) return null;

  const player1 = battleMatches[0].player1;
  const player2 = battleMatches[0].player2;

  const summary = {
    [player1._id]: { wins: 0, perfects: 0, cleanSweeps: 0, player: player1 },
    [player2._id]: { wins: 0, perfects: 0, cleanSweeps: 0, player: player2 },
  };

  battleMatches.forEach((match) => {
    summary[match.winner].wins += 1;
    summary[match.player1._id].perfects += match.player1Perfects;
    summary[match.player2._id].perfects += match.player2Perfects;
    if (match.cleanSweep) summary[match.winner].cleanSweeps += 1;
  });

  const [dominantId, dominant] = Object.entries(summary).reduce((a, b) => {
    const aStats = a[1];
    const bStats = b[1];

    if (bStats.wins !== aStats.wins) {
      return bStats.wins > aStats.wins ? b : a;
    }

    if (bStats.perfects !== aStats.perfects) {
      return bStats.perfects > aStats.perfects ? b : a;
    }

    if (bStats.cleanSweeps !== aStats.cleanSweeps) {
      return bStats.cleanSweeps > aStats.cleanSweeps ? b : a;
    }

    return a; // fallback (e.g., first player)
  });

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
