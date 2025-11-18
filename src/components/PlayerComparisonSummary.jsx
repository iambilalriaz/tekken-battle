'use client';

import PlayerImage from '@/components/matches/PlayerImage';
import clsx from 'clsx';

// ------------------------
// Player Column Component
// ------------------------
const PlayerColumn = ({ player }) => {
  if (!player) return null;

  return (
    <div className='flex flex-col items-center gap-1'>
      <PlayerImage
        player={{ profileImageUrl: player.profileImage }}
        isWinner={player.isWinner}
        displayName={true}
      />
      <h3 className='text-lg font-semibold text-center'>
        {player.name?.split(' ')?.[0]}
      </h3>
    </div>
  );
};

// ------------------------
// Reusable Stat Comparison Row
// ------------------------
const StatComparisonRow = ({ label, p1, p2 }) => {
  const isP1Better = p1 > p2;
  const isP2Better = p2 > p1;

  return (
    <div>
      <p className='my-2 font-extrabold text-white'>{label}</p>

      <div className='flex justify-center items-center gap-1 font-bold '>
        {/* Player 1 */}
        <p
          className={clsx('p-2 w-full rounded-l', {
            'bg-success': isP1Better,
            'bg-error': isP2Better,
            'bg-white text-primary': p1 === p2,
          })}
        >
          {p1}
        </p>
        {/* Player 2 */}
        <p
          className={clsx('p-2 w-full rounded-r', {
            'bg-success': isP2Better,
            'bg-error': isP1Better,
            'bg-white text-primary': p1 === p2,
          })}
        >
          {p2}
        </p>
      </div>
    </div>
  );
};

// ------------------------
// Main Component
// ------------------------
const PlayerComparisonSummary = ({ data, currentUser }) => {
  if (!data || !currentUser) return null;

  const { totalMatches, isDraw, winner, loser } = data ?? {};

  const players = [
    {
      id: winner?.name === 'You' ? currentUser.id : 'opponent',
      ...winner,
      isWinner: !isDraw,
    },
    {
      id: loser?.name === 'You' ? currentUser.id : 'opponent',
      ...loser,
      isWinner: false,
    },
  ];

  const [player1, player2] = players;

  return (
    <div className='text-center mt-8 max-w-lg m-auto'>
      {/* Player Images */}
      <div className='flex justify-evenly items-center mb-4'>
        <PlayerColumn player={player1} />
        <img src='/vs.png' alt='VS' width={100} />
        <PlayerColumn player={player2} />
      </div>

      {/* Total Matches */}
      <p className='bg-white text-primary  py-2 font-bold my-6'>
        Total Matches: {totalMatches}
      </p>

      {/* Reusable Stat Rows */}
      <StatComparisonRow
        label='Wins'
        p1={player1.winCount}
        p2={player2.winCount}
      />
      <StatComparisonRow
        label='Perfects'
        p1={player1.perfects}
        p2={player2.perfects}
      />
      <StatComparisonRow
        label='Clean Sweeps'
        p1={player1.cleanSweeps}
        p2={player2.cleanSweeps}
      />
      <StatComparisonRow
        label='Win %'
        p1={player1.winPercentage}
        p2={player2.winPercentage}
      />
    </div>
  );
};

export default PlayerComparisonSummary;
