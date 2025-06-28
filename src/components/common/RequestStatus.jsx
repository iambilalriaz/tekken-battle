const STATUSES = {
  pending: 'bg-dodger-blue',
  accepted: 'bg-success',
  rejected: 'bg-error',
};
const RequestStatus = ({ status }) => {
  return (
    <p
      className={`${STATUSES[status]} text-sm font-semibold rounded px-2 py-1 capitalize`}
    >
      {status}
    </p>
  );
};

export default RequestStatus;
