import BattleRequest from './BattleRequest';
import GlassyModal from './common/GlassyModal';

const PendingRequests = ({ isOpen, data, onClose }) => {
  return (
    <GlassyModal isOpen={isOpen} title='Battle Invites' onClose={onClose}>
      {data?.map((request) => (
        <BattleRequest
          key={request?._id}
          battleRequest={request}
          closeModal={onClose}
        />
      ))}
    </GlassyModal>
  );
};

export default PendingRequests;
