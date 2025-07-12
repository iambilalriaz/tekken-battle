import clsx from 'clsx';

const StatsBox = ({ statLabel, firstValue, secondValue }) => {
  const getBgColor = (a, b) => {
    if (a > b) return 'bg-success';
    if (a < b) return 'bg-error';
    return 'bg-secondary !text-black';
  };

  return (
    <div className='flex justify-between items-center bg-black my-4 font-bold uppercase text-sm md:text-base'>
      <div
        className={clsx(
          'p-2 w-10 md:w-12 text-center',
          getBgColor(firstValue, secondValue)
        )}
      >
        {firstValue}
      </div>
      <div className='bg-black'>{statLabel}</div>
      <div
        className={clsx(
          'p-2 w-10 md:w-12 text-center',
          getBgColor(secondValue, firstValue)
        )}
      >
        {secondValue}
      </div>
    </div>
  );
};

export default StatsBox;
