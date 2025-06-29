const STATUSES = {
  requested: 'bg-dodger-blue',
  'in-match': 'bg-success',
  rejected: 'bg-error',
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
