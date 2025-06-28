'use client';

import MainLayout from '@/layouts/MainLayout';
import Pusher from 'pusher-js';

import { useEffect } from 'react';

import { useBattleRequests } from '@/store/useBattleRequests';
import GlassyCard from '@/components/common/GlassyCard';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useIsSameUser } from '@/hooks/useIsSameUser';
import RequestStatus from '@/components/common/RequestStatus';
import { useAuthStatus } from '@/hooks/useAuthStatus';

const BattleRequests = () => {
  const { user } = useAuthStatus();
  const { battleRequests, concatBattleRequest } = useBattleRequests();
  const { isSameUser } = useIsSameUser();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: '/api/pusher/auth', // ✅ Required for private channels
      auth: {
        withCredentials: true, // ✅ Important for cookie-based auth
      },
    });

    const channel = pusher.subscribe(`private-user-${user?.userId}`);
    channel.bind('battle-request-received', (response) => {
      concatBattleRequest(response);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [user?.userId]);

  return (
    <MainLayout>
      <GlassyCard title='Battle Requests'>
        {battleRequests?.length ? (
          battleRequests?.map((request) => {
            const { status, requester, _id, acceptor } = request ?? {};
            const isRequesterLoggedIn = isSameUser(requester?.id);
            return (
              <div
                key={_id}
                className='border border-white border-dashed p-4 md:flex justify-between items-center my-4'
              >
                <p className='text-white md:pr-2'>
                  {isRequesterLoggedIn ? (
                    <p>
                      You have requested{' '}
                      <span className='text-secondary font-semibold'>
                        {acceptor?.name}
                      </span>{' '}
                      to play with you!
                    </p>
                  ) : (
                    <>
                      <span className='text-secondary font-semibold'>
                        {requester?.name}
                      </span>{' '}
                      wants to play with you!
                    </>
                  )}
                </p>
                {isRequesterLoggedIn ? (
                  <div className='w-fit ml-auto mt-4 md:mt-0'>
                    <RequestStatus status={status} />
                  </div>
                ) : (
                  <div className='flex items-center justify-end mt-4 md:mt-0'>
                    {/* <Loader size='xs' /> */}
                    <FaCheck
                      className='text-success cursor-pointer'
                      size={24}
                    />
                    <FaTimes
                      className='text-error ml-4 cursor-pointer'
                      size={24}
                    />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className='text-center p-8 text-sm md:text-base text-white'>
            No requests found.
          </p>
        )}
      </GlassyCard>
    </MainLayout>
  );
};

export default BattleRequests;
