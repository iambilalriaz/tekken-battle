import { useAllUsers } from '@/store/useAllUsers';
import { useDashboardStats } from '@/store/useDashboardStats';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import PlayerImage from '@/components/matches/PlayerImage';
import { RiExportFill } from 'react-icons/ri';
import Loader from '@/components/common/Loader';
import clsx from 'clsx';
import { useSelectedOpponent } from '@/store/useSelectedOpponent';
import { useSelectOpponentFilterModal } from '@/store/useSelectOpponentFilterModal';

const DashboardFilters = ({ handleExport, isExporting }) => {
  const { allUsers } = useAllUsers();

  const { toggleOpponentFilterSelectionModal } = useSelectOpponentFilterModal();
  const { selectedOpponent } = useSelectedOpponent();

  const { statsDate, setStatsDate, dashboardStats } = useDashboardStats();

  const selectedOpponentPlayer = allUsers?.find(
    (user) => user?.userId === selectedOpponent
  );
  const opponentPlayerName = selectedOpponentPlayer?.name?.split(' ')?.[0];
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex justify-center gap-2 rounded p-3 items-stretch'>
        <div className={clsx(dashboardStats ? 'w-2/5' : 'w-1/2')}>
          <CustomDatePicker startDate={statsDate} setStartDate={setStatsDate} />
        </div>

        <button
          onClick={toggleOpponentFilterSelectionModal}
          className={clsx(
            '!bg-black/50 backdrop-blur-sm text-white border border-white/50 placeholder-black/70 rounded-xl text-center cursor-pointer flex justify-center gap-2 items-center',
            dashboardStats ? 'w-2/5' : 'w-1/2'
          )}
        >
          {selectedOpponent ? (
            <PlayerImage
              imageDimensions='w-6 h-6 md:w-8 md:h-8 py-0 !border-dodger-blue'
              player={{
                profileImageUrl: selectedOpponentPlayer?.profileImage,
              }}
            />
          ) : null}
          <p className='text-sm md:text-base'>
            {selectedOpponent ? opponentPlayerName : '-- Opponent --'}
          </p>
        </button>
        <div
          className={clsx(
            'bg-black/50 backdrop-blur-sm text-white border border-white/50 placeholder-black/70 rounded-xl text-center cursor-pointer flex justify-center gap-2 items-center',
            dashboardStats ? 'w-1/5 md:w-2/5' : 'hidden'
          )}
        >
          {isExporting ? (
            <Loader size='xs' />
          ) : (
            <div
              className='w-full h-full flex justify-center gap-2 items-center text-secondary'
              onClick={handleExport}
            >
              <p className='hidden md:block text-sm font-bold text-white'>
                Export
              </p>
              <RiExportFill className='text-3xl md:text-xl' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;
