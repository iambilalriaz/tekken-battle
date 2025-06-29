import Button from './common/Button';

const RespondButtons = ({ config }) => {
  const { success, cancel } = config ?? {};

  return (
    <div className='flex items-center justify-center gap-4 mt-4 md:mt-0'>
      <Button variant='danger' onClick={cancel.handler}>
        {cancel?.title}
      </Button>
      <Button variant='dodger-blue' onClick={success.handler}>
        {success?.title}
      </Button>
    </div>
  );
};

export default RespondButtons;
