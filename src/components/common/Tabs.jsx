'use client';

import { useState } from 'react';
import GlassyCard from '@/components/common/GlassyCard';
import clsx from 'clsx';

export default function Tabs({ tabs, defaultActive = 0 }) {
  const [active, setActive] = useState(defaultActive);

  return (
    <GlassyCard role='tablist'>
      <div className='flex justify-center gap-4'>
        {tabs.map((tab, index) => (
          <button
            key={index}
            role='tab'
            onClick={() => setActive(index)}
            className={clsx(
              'px-3 py-2 transition-all duration-300 cursor-pointer w-full',
              {
                'tab-active bg-secondary text-primary font-bold':
                  active === index,
              },
              {
                'text-white border-b-1 border-white hover:bg-white hover:text-primary':
                  active !== index,
              }
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className='rounded-2xl bg-base-100 shadow-md max-h-[60dvh] overflow-auto mt-4'>
        {tabs[active]?.content}
      </div>
    </GlassyCard>
  );
}
