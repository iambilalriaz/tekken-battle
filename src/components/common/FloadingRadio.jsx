'use client';

import clsx from 'clsx';

const FloatingRadio = ({
  classes = '',
  label = '',
  options = [],
  disabled = false,
  name = '',
  value,
  onChange,
}) => {
  return (
    <div className={clsx('relative w-full', classes)}>
      {/* Label */}
      <span className='font-semibold text-white'>{label}</span>

      <div className='flex gap-3 pt-3 flex-wrap'>
        {options.map((opt) => {
          const isSelected = value === opt.value;

          return (
            <label
              key={opt.value}
              className={clsx(
                'relative cursor-pointer select-none px-4 py-2 rounded-xl border transition-all duration-200',
                isSelected
                  ? 'bg-secondary text-primary font-semibold border-secondary shadow-md scale-105'
                  : 'bg-transparent text-gray-300 border-gray-500 hover:border-secondary hover:text-secondary',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <input
                type='radio'
                name={name || label.toLowerCase().replace(/\s+/g, '-')}
                value={opt.value}
                checked={isSelected}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className='hidden'
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default FloatingRadio;
