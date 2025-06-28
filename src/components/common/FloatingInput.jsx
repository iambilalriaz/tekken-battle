'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { LuEye, LuEyeOff } from 'react-icons/lu';

const FloatingInput = (props) => {
  const { classes = '', label = '', type = 'text', name = '' } = props;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && !showPassword ? 'password' : 'text';

  return (
    <div className={clsx('relative w-full', classes)}>
      <input
        {...props}
        type={inputType}
        id={label.toLowerCase().replace(/\s+/g, '-')}
        className={clsx(
          'input input-bordered w-full peer pt-6 pb-1 placeholder-transparent text-white pl-3 pr-10 border-white border',
          'focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary'
        )}
        placeholder={label}
        name={name}
      />
      <label
        htmlFor={label.toLowerCase().replace(/\s+/g, '-')}
        className={clsx(
          'absolute left-3 top-2 text-gray  transition-all text-sm',
          'peer-placeholder-shown:top-4 peer-focus:text-xs peer-placeholder-shown:text-gray',
          'peer-focus:top-1 peer-focus:text-secondary'
        )}
      >
        {label}
      </label>

      {isPassword && (
        <button
          type='button'
          className='absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-secondary cursor-pointer'
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
        >
          {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
        </button>
      )}
    </div>
  );
};

export default FloatingInput;
