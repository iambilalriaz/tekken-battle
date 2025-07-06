import clsx from 'clsx';
import { FaCrown } from 'react-icons/fa';

const PlayerImage = ({
  player,
  isWinner,
  displayName = true,
  imageDimensions = 'w-16 h-16 sm:w-20 sm:h-20',
}) => {
  return (
    <>
      <div className='relative'>
        <div className={imageDimensions}>
          <img
            src={player?.profileImageUrl}
            alt={player?.firstName}
            className={clsx(
              `${imageDimensions} rounded-full border-2 object-cover`,
              isWinner ? 'border-success' : 'border-error'
            )}
          />
        </div>
        {isWinner && (
          <FaCrown className='absolute -z-1 -rotate-30 -top-4 -md:top-6 left-0 text-secondary text-3xl' />
        )}
      </div>
      {displayName && (
        <p className='text-xs sm:text-sm font-semibold mt-1'>
          {player?.firstName}
        </p>
      )}
    </>
  );
};

export default PlayerImage;
