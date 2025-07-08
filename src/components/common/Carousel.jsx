'use client';

import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import GlassyCard from './GlassyCard';
import { useSwipeable } from 'react-swipeable';
import CustomDatePicker from './CustomDatePicker';
import { useToggleComparisonModal } from '@/store/useToggleComparisonModal';
import { useAllUsers } from '@/store/useAllUsers';

const Carousel = ({
  items,
  onSlideChange,
  isDateInput = false,
  datePickerProps = null,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(''); // for animation
  const { selectedOpponent, toggleComparisonModal } =
    useToggleComparisonModal();

  const { allUsers } = useAllUsers();

  const selectedPlayer = allUsers?.find(
    ({ userId }) => userId === selectedOpponent
  );

  const handlePrev = () => {
    setDirection('left');
    const newIndex = (currentIndex - 1 + items.length) % items.length;
    setCurrentIndex(newIndex);
    onSlideChange('left');
  };

  const handleNext = () => {
    setDirection('right');
    const newIndex = (currentIndex + 1) % items.length;
    setCurrentIndex(newIndex);
    onSlideChange('right');
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: true, // allow swiping with mouse for desktop
  });

  const animationClass =
    direction === 'right'
      ? 'animate__animated animate__slideInRight'
      : direction === 'left'
      ? 'animate__animated animate__slideInLeft'
      : '';

  return (
    <div className='relative w-full max-w-md mx-auto select-none'>
      <div className='flex justify-between items-center mb-4 gap-2'>
        <div className='flex items-center justify-between'>
          <button
            onClick={handlePrev}
            className='text-white hover:text-gray-300 transition'
          >
            <FaChevronLeft size={24} />
          </button>
          {isDateInput && (
            <div>
              <CustomDatePicker {...datePickerProps} />
            </div>
          )}
          <button
            onClick={handleNext}
            className='text-white hover:text-gray-300 transition'
          >
            <FaChevronRight size={24} />
          </button>
        </div>{' '}
      </div>

      <div {...swipeHandlers}>
        <GlassyCard>
          <div className={animationClass} key={currentIndex}>
            {items[currentIndex]}
          </div>
        </GlassyCard>
      </div>
    </div>
  );
};

export default Carousel;
