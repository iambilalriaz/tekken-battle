'use client';

import React from 'react';

const CounterInput = ({
  label,
  name,
  value = 0,
  onChange,
  min = 0,
  max = 3,
  classes = '',
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${classes}`}>
      <label htmlFor={name} className='font-semibold text-white mb-2'>
        {label}
      </label>
      <div className='flex items-center gap-2'>
        <button
          type='button'
          onClick={handleDecrement}
          className='px-2.5 py-0.5 text-xl rounded-full bg-white text-primary cursor-pointer'
        >
          –
        </button>
        <div className='w-16 text-xl text-center text-secondary font-semibold rounded-md py-1'>
          {value}
        </div>
        <button
          type='button'
          onClick={handleIncrement}
          className='px-2.5 py-0.5 text-xl rounded-full bg-white text-primary cursor-pointer'
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CounterInput;
