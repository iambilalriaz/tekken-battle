import { BATTLE_STATUSES } from '@/constants';

const STATUSES = {
  [BATTLE_STATUSES.REQUESTED]: 'bg-dodger-blue',
  [BATTLE_STATUSES.IN_MATCH]: 'bg-success',
  [BATTLE_STATUSES.REJECTED]: 'bg-error',
  [BATTLE_STATUSES.FINISHED]: 'bg-success',
};
const RequestStatus = ({ status }) => {
  return (
    <p
      className={`${STATUSES[status]} text-xs sm:text-sm font-bold rounded px-2 py-0.5 capitalize`}
    >
      {status}
    </p>
  );
};

export default RequestStatus;
