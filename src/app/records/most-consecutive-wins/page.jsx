'use client';

import { useEffect, useState } from 'react';
import GlassyCard from '@/components/common/GlassyCard';
import Loader from '@/components/common/Loader';
import { getMostConsecutiveWinsRecord } from '@/lib/api';
import { FaTrophy, FaCalendar, FaFire } from 'react-icons/fa';
import MainLayout from '@/layouts/MainLayout';

const MostConsecutiveWinsPage = () => {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    setMounted(true);
    const fetchRecord = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMostConsecutiveWinsRecord();
        setRecord(response);
      } catch (err) {
        console.error('Error fetching record:', err);
        setError(err?.errorMessage || 'Failed to fetch record');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, []);

  if (!mounted || loading) {
    return (
      <div className='min-h-screen pt-20 px-4 md:px-8 flex items-center justify-center'>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen pt-20 px-4 md:px-8 flex items-center justify-center'>
        <GlassyCard>
          <div className='text-center text-red-400'>
            <p>{error}</p>
          </div>
        </GlassyCard>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className='max-w-4xl mx-auto my-20'>
        <div className='text-center mb-2'>
          <h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>
            Most Consecutive Wins
          </h1>
          <p className='text-gray-300'>
            The longest winning streak in a single day
          </p>
        </div>

        {!record ? (
          <GlassyCard>
            <div className='text-center text-gray-300 py-8'>
              <p>No records found yet. Start battling to create history!</p>
            </div>
          </GlassyCard>
        ) : (
          <GlassyCard>
            <div className='flex flex-col items-center space-y-6 py-8'>
              {/* Winner Section */}
              <div className='relative'>
                <div className='absolute -top-2 -right-2 bg-yellow-400 rounded-full p-3 shadow-lg z-10'>
                  <FaTrophy className='text-2xl text-primary' />
                </div>
                <div className='w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl'>
                  <img
                    src={record.playerImage || '/default-avatar.png'}
                    alt={record.playerName}
                    className='object-cover w-full h-full'
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                </div>
              </div>

              <div className='text-center space-y-3'>
                <h2 className='text-2xl md:text-3xl font-bold text-white'>
                  {record.playerName}
                </h2>
                <div className='flex items-center justify-center space-x-3 text-yellow-400'>
                  <FaFire className='text-2xl animate-pulse' />
                  <span className='text-5xl md:text-6xl font-bold'>
                    {record.consecutiveWins}
                  </span>
                  <span className='text-xl md:text-2xl font-semibold'>
                    Wins in a Row
                  </span>
                </div>
              </div>

              {/* Opponent Section */}
              {record.opponentName && (
                <div className='w-full pt-4 border-t border-white/20'>
                  <p className='text-center text-gray-400 mb-3'>Opponent</p>
                  <div className='flex flex-col items-center justify-center space-x-4'>
                    <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-red-400 shadow-lg'>
                      <img
                        src={record.opponentImage || '/default-avatar.png'}
                        alt={record.opponentName}
                        className='object-cover w-full h-full'
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    </div>
                    <p className='text-lg md:text-xl mt-2 font-semibold text-white'>
                      {record.opponentName}
                    </p>
                  </div>
                </div>
              )}

              {/* Record Date */}
              <div className='w-full pt-4 border-t border-white/20'>
                <div className='flex items-center justify-center space-x-2 text-gray-300'>
                  <FaCalendar />
                  <span>{formatDate(record.recordDate)}</span>
                </div>
              </div>
            </div>
          </GlassyCard>
        )}
      </div>
    </MainLayout>
  );
};

export default MostConsecutiveWinsPage;
