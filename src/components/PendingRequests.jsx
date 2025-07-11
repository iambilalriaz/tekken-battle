import Battle from '@/components/Battle';
import GlassyModal from '@/components/common/GlassyModal';

const PendingRequests = ({ isOpen, data, onClose }) => {
  return (
    <GlassyModal isOpen={isOpen} title='Battle Invites' onClose={onClose}>
      {data?.map((request) => (
        <Battle key={request?._id} battle={request} closeModal={onClose} />
      ))}
    </GlassyModal>
  );
};

export default PendingRequests;
