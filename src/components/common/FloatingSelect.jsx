'use client';

import clsx from 'clsx';
import { RiArrowDropDownLine } from 'react-icons/ri';

const FloatingSelect = (props) => {
  const {
    classes = '',
    label = '',
    options = [],
    disabled = false,
    inputStyles = '',
  } = props;
  return (
    <div className={clsx('relative w-full', classes)}>
      <select
        id={label.toLowerCase().replace(/\s+/g, '-')}
        disabled={disabled}
        className={clsx(
          'input input-bordered w-full peer pt-6 pb-1 placeholder-transparent text-white pl-3 pr-10 border-white border bg-transparent',
          'focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary appearance-none',
          inputStyles
        )}
        {...props}
      >
        <option value='' disabled hidden>
          -- Select --
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className='text-black'>
            {opt.label}
          </option>
        ))}
      </select>

      <label
        htmlFor={label.toLowerCase().replace(/\s+/g, '-')}
        className={clsx(
          'absolute left-3 top-2 text-gray transition-all text-sm',
          'peer-placeholder-shown:top-4 peer-focus:text-xs peer-placeholder-shown:text-gray',
          'peer-focus:top-1 peer-focus:text-secondary'
        )}
      >
        {label}
      </label>

      {/* Optional dropdown icon (you can style or replace it) */}
      <div className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white'>
        <RiArrowDropDownLine width={100} className='text-3xl' />
      </div>
    </div>
  );
};

export default FloatingSelect;
