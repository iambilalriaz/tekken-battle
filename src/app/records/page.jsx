'use client';

import { useRouter } from 'next/navigation';
import GlassyCard from '@/components/common/GlassyCard';
import { APP_ROUTES } from '@/constants/app-routes';
import { FaTrophy } from 'react-icons/fa';
import MainLayout from '@/layouts/MainLayout';

const RecordsPage = () => {
  const router = useRouter();

  const records = [
    {
      title: 'Most Consecutive Wins',
      description: 'See who holds the record for most wins in a row',
      icon: <FaTrophy className='text-4xl text-yellow-400' />,
      route: APP_ROUTES.RECORDS.MOST_CONSECUTIVE_WINS,
    },
  ];

  return (
    <MainLayout>
      <div className='max-w-6xl mx-auto my-20'>
        <h1 className='text-3xl md:text-4xl font-bold text-white mb-8 text-center'>
          Records
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6'>
          {records.map((record, index) => (
            <GlassyCard
              key={index}
              styles='cursor-pointer hover:scale-105 transition-transform duration-200'
              cardStyles='h-full'
            >
              <div
                onClick={() => router.push(record.route)}
                className='flex flex-col items-center justify-center text-center space-y-4 py-6'
              >
                <div className='mb-2'>{record.icon}</div>
                <h2 className='text-xl font-semibold text-white'>
                  {record.title}
                </h2>
                <p className='text-sm text-gray-300'>{record.description}</p>
              </div>
            </GlassyCard>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default RecordsPage;
