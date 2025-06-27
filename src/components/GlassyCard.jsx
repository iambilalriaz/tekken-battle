'use client';

import clsx from 'clsx';

const GlassyCard = ({ title, children, styles }) => {
  return (
    <div className={clsx('p-4', styles)}>
      <div className='glass w-full p-6 rounded-2xl shadow-lg border border-white/20 backdrop-blur-md'>
        <h2 className='text-4xl font-bold text-white mb-2'>{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default GlassyCard;
