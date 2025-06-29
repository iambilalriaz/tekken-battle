'use client';

import clsx from 'clsx';

const GlassyCard = ({ title, children, styles = '' }) => {
  return (
    <div className={clsx('p-4', '', styles)}>
      <div className='glass w-full p-6 rounded-2xl shadow-lg border border-white/20 backdrop-blur-md'>
        {title && (
          <h2 className='text-xl font-bold text-white mb-2 border-b-2 border-white border-dashed w-fit'>
            {title}
          </h2>
        )}
        <div className='text-wrap'>{children}</div>
      </div>
    </div>
  );
};

export default GlassyCard;
// mt-16 w-full lg:max-w-2/4 mx-auto
