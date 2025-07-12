import SelectOpponent from '@/components/SelectOpponent';
import { useSelectedOpponent } from '@/store/useSelectedOpponent';
import { useSelectOpponentFilterModal } from '@/store/useSelectOpponentFilterModal';

const SelectOpponentFilterModal = () => {
  const { selectOpponentFilterModal, toggleOpponentFilterSelectionModal } =
    useSelectOpponentFilterModal();

  const { setSelectedOpponent } = useSelectedOpponent();

  const onOpponentSelection = (id) => {
    setSelectedOpponent(id);
    toggleOpponentFilterSelectionModal();
  };
  return (
    <SelectOpponent
      onSelectOpponent={onOpponentSelection}
      showModal={selectOpponentFilterModal}
      toggleModal={toggleOpponentFilterSelectionModal}
    />
  );
};

export default SelectOpponentFilterModal;
