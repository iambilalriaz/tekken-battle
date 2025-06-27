'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { LuEye, LuEyeOff } from 'react-icons/lu';

const FloatingInput = ({
  inputClass = '',
  inputValue,
  setInputValue,
  label = '',
  type = 'text',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && !showPassword ? 'password' : 'text';

  return (
    <div className={clsx('relative w-full', inputClass)}>
      <input
        type={inputType}
        id={label.toLowerCase().replace(/\s+/g, '-')}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={clsx(
          'input input-bordered w-full peer pt-6 pb-2 placeholder-transparent text-white pl-3 pr-10 border-white border',
          'focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary'
        )}
        placeholder={label}
      />
      <label
        htmlFor={label.toLowerCase().replace(/\s+/g, '-')}
        className={clsx(
          'absolute left-3 top-2 text-gray-400 text-sm transition-all',
          'peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500',
          'peer-focus:top-2 peer-focus:text-sm peer-focus:text-secondary'
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
