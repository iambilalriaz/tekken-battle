'use client';

import { GiBroom } from 'react-icons/gi';
import PlayerImage from './matches/PlayerImage';
import { useDashboardStats } from '../store/useDashboardStats';
import dayjs from 'dayjs';
import GlassyCard from './common/GlassyCard';

const PlayerComparisonSummary = ({ data, currentUser }) => {
  const { statsDate } = useDashboardStats();
  if (!data || !currentUser) return null;
  const {
    opponent,
    totalMatches,
    yourPerfects,
    opponentPerfects,
    yourCleanSweeps,
    opponentCleanSweeps,
  } = data ?? {};

  const yourWins = totalMatches - opponentCleanSweeps; // Assumption: each clean sweep = 1 win
  const opponentWins = totalMatches - yourCleanSweeps;

  let dominant;
  if (yourWins !== opponentWins) {
    dominant = yourWins > opponentWins ? currentUser : opponent;
  } else if (yourPerfects !== opponentPerfects) {
    dominant = yourPerfects > opponentPerfects ? currentUser : opponent;
  } else if (yourCleanSweeps !== opponentCleanSweeps) {
    dominant = yourCleanSweeps > opponentCleanSweeps ? currentUser : opponent;
  }

  const players = [
    {
      id: currentUser.id,
      name: currentUser.name,
      profileImage: currentUser.profileImage,
      wins: yourWins,
      perfects: yourPerfects,
      cleanSweeps: yourCleanSweeps,
    },
    {
      id: opponent.id,
      name: opponent.name,
      profileImage: opponent.profileImage,
      wins: opponentWins,
      perfects: opponentPerfects,
      cleanSweeps: opponentCleanSweeps,
    },
  ].sort((a, b) => (a.id === dominant?.id ? -1 : 1));

  const winRate = ((players?.[0]?.wins / totalMatches) * 100).toFixed();
  return (
    <div className='mx-4 pb-20'>
      <div className='flex justify-center gap-1 my-6 text-3xl md:text-5xl'>
        <p>🏆</p>
        <div>
          <h1 className='font-bold'>
            {dominant?.name} dominated on{' '}
            {dayjs(statsDate).format('DD MMM, YYYY')}
          </h1>

          <div className='text-white/80'>
            {/* Desktop View (Single Line) */}
            <h3 className='text-xl mt-4 hidden md:block'>
              {totalMatches} matches played — {winRate}% win rate
            </h3>

            {/* Mobile View (Stacked Lines) */}
            <div className='block md:hidden text-lg mt-4 font-semibold space-y-1'>
              <h3>— {totalMatches} matches played</h3>
              <h3>— {winRate}% win rate</h3>
            </div>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 md:max-w-3/4 mx-auto'>
        {players.map((p) => (
          <div
            key={p.id}
            className={`rounded-xl p-6 relative bg-black/20 backdrop-blur shadow-white shadow-xs`}
          >
            <div className='flex items-center gap-4 mb-4'>
              <PlayerImage
                player={{
                  profileImageUrl: p?.profileImage,
                }}
                isWinner={dominant?.id === p?.id}
                displayName={false}
              />
              <h3 className='text-2xl font-semibold text-center'>{p.name}</h3>
            </div>

            <ul className='text-sm space-y-1'>
              <li>
                🏆 Wins: <span className='font-bold'>{p.wins}</span>
              </li>
              <li>
                💯 Perfect Rounds:{' '}
                <span className='font-bold'>{p.perfects}</span>
              </li>
              <li>
                <GiBroom className='inline-block mb-1 mr-1 text-blue-400' />
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
