'use client';

import clsx from 'clsx';

const GlassyCard = ({ title, children, styles = 'w-full md:w-1/2' }) => {
  return (
    <div className={clsx('p-4', styles)}>
      <div className='glass w-full p-6 rounded-2xl shadow-lg border border-white/20 backdrop-blur-md'>
        <h2 className='text-xl font-bold text-white mb-2 border-b-2 border-white border-dashed w-fit'>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default GlassyCard;
