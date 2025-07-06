'use client';

import DatePicker from 'react-datepicker';
import { FaCalendarAlt } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
const CustomDatePicker = ({ startDate, setStartDate }) => {
  return (
    <div className='relative w-full'>
      <DatePicker
        selected={startDate}
        onChange={setStartDate}
        popperPlacement='bottom-end'
        dateFormat='dd MMM yyyy'
        className='w-full py-4 pl-12 pr-4 rounded-xl bg-black/50 backdrop-blur-sm text-white placeholder-black/70 focus:outline-none text-sm md:text-base cursor-pointer'
        calendarClassName='!bg-white !text-black rounded-xl p-4'
        popperClassName='!z-50'
        dayClassName={() =>
          'hover:bg-blue-600 hover:text-white transition-all rounded-full w-10 h-10 flex items-center justify-center'
        }
      />
      <FaCalendarAlt className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white pointer-events-none border-r border-gray pr-2 w-6' />
    </div>
  );
};

export default CustomDatePicker;
