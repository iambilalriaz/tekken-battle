import GlassyModal from '@/components/common/GlassyModal';
import { useToggleComparisonModal } from '../store/useToggleComparisonModal';
import { useAllUsers } from '../store/useAllUsers';

const SelectOpponentFilterModal = () => {
  const { comparisonModal, toggleComparisonModal, setSelectedOpponent } =
    useToggleComparisonModal();

  const { allUsers } = useAllUsers();

  const onOpponentSelection = (id) => {
    setSelectedOpponent(id);
    toggleComparisonModal();
  };
  return (
    <GlassyModal
      isOpen={comparisonModal}
      onClose={toggleComparisonModal}
      title='Select Opponent'
    >
      {allUsers?.length ? (
        allUsers?.map((user) => (
          <div
            key={user?.userId}
            className='flex items-center hover:bg-gray/20 active:bg-gray/20 cursor-pointer p-2 select-none animate__animated animate__rollIn'
            onClick={() => onOpponentSelection(user?.userId)}
          >
            <div className='w-10 h-10 rounded-full overflow-hidden border-4 border-white'>
              <img src={user?.profileImage} width={50} height={50} />
            </div>
            <p className='font-semibold ml-3'>{user?.name}</p>
          </div>
        ))
      ) : (
        <p className='flex justify-center items-center max-w-sm text-center mx-auto'>
          Looks like you don’t have any opponents yet.
        </p>
      )}
    </GlassyModal>
  );
};

export default SelectOpponentFilterModal;
