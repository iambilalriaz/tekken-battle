import { useAllUsers } from '@/store/useAllUsers';
import { useDashboardStats } from '@/store/useDashboardStats';
import { useToggleComparisonModal } from '@/store/useToggleComparisonModal';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import PlayerImage from '@/components/matches/PlayerImage';

const DashboardFilters = () => {
  const { allUsers } = useAllUsers();

  const { selectedOpponent, toggleComparisonModal } =
    useToggleComparisonModal();

  const { statsDate, setStatsDate } = useDashboardStats();

  const selectedOpponentPlayer = allUsers?.find(
    (user) => user?.userId === selectedOpponent
  );
  const opponentPlayerName = selectedOpponentPlayer?.name?.split(' ')?.[0];
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex justify-center gap-2 rounded p-3 items-stretch'>
        <div className='w-1/2'>
          <CustomDatePicker startDate={statsDate} setStartDate={setStatsDate} />
        </div>

        <button
          onClick={toggleComparisonModal}
          className='w-1/2 !bg-black/50 backdrop-blur-sm text-white border border-white/50 placeholder-black/70 rounded-xl text-center cursor-pointer flex justify-center gap-2 items-center'
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
      </div>
    </div>
  );
};

export default DashboardFilters;
