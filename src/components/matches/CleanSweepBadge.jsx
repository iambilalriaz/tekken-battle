'use client';
import { FaTimesCircle } from 'react-icons/fa';
import clsx from 'clsx';
import { FaSquareCheck } from 'react-icons/fa6';

const CleanSweepBadge = ({ cleanSweep }) => (
  <div className='text-xs text-center font-semibold flex justify-center items-center gap-1 mt-4'>
    Clean Sweep:{' '}
    <span
      className={clsx(
        'font-bold',
        cleanSweep ? 'text-success' : 'text-error',
        'text-sm'
      )}
    >
      {cleanSweep ? <FaSquareCheck /> : <FaTimesCircle />}
    </span>
  </div>
);
export default CleanSweepBadge;
