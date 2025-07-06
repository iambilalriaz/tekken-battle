'use client';
import { FaCrown } from 'react-icons/fa6';
import clsx from 'clsx';
import PlayerImage from './PlayerImage';

const PlayerCard = ({
  player,
  perfects,
  isWinner = false,
  isBattleDetails = false,
}) => (
  <div className='flex flex-col items-center text-center'>
    <PlayerImage player={player} isWinner={isWinner} />
    {!isBattleDetails && (
      <span
        className={clsx(
          'text-xs sm:text-sm font-bold',
          isWinner ? 'text-success' : 'text-error'
        )}
      >
        {perfects} Perfect{perfects !== 1 && 's'}
      </span>
    )}
  </div>
);

export default PlayerCard;
