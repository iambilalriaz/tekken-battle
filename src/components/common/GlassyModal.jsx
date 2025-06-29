'use client';

import { useEffect } from 'react';

export default function GlassyModal({
  title = '',
  isOpen,
  onClose,
  children,
  styles = 'w-full lg:w-1/2',
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm'
      onClick={onClose}
    >
      <div
        className='bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20 text-white transition-all duration-300 scale-100'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>{title}</h2>
          <button
            className='text-white hover:text-red-400 transition'
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
