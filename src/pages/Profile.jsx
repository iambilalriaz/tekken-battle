'use client';

import MainLayout from '@/layouts/MainLayout';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import GlassyCard from '@/components/common/GlassyCard';
import PlayerImage from '@/components/matches/PlayerImage';
import ProfileDetailsCard from '@/components/ProfileDetailsCard';
import { FaPencilAlt } from 'react-icons/fa';
import { useNetworkRequest } from '@/hooks/useNetworkRequest';
import { fetchLoggedInUserAPI } from '@/lib/api';
import Loader from '@/components/common/Loader';
import { useCallback, useEffect } from 'react';
import UpdatePictureModal from '@/components/UpdatePictureModal';
import { useCustomerProfile } from '@/store/useCustomerProfile';

const Profile = () => {
  const { loggedInUser, setLoggedInUser } = useLoggedInUser();
  const { toggleUpdateProfileModal } = useCustomerProfile();
  const {
    email,
    firstName,
    id,
    lastName,
    profileImageUrl,
    totalMatches,
    gamesWon,
    cleanSweaps,
    perfects,
  } = loggedInUser ?? {};

  const {
    loading: fetchingUser,
    errorMessage,
    executeFunction: fetchLoggedInUser,
  } = useNetworkRequest({
    apiFunction: fetchLoggedInUserAPI,
    initialLoader: true,
  });
  const getLoggedInUser = useCallback(async () => {
    const data = await fetchLoggedInUser();
    setLoggedInUser(data);
  }, []);
  useEffect(() => {
    getLoggedInUser();
  }, []);
  useEffect(() => {}, []);
  return (
    <MainLayout>
      <GlassyCard styles='w-full max-w-xl'>
        {fetchingUser ? (
          <Loader />
        ) : (
          <section className='grid place-items-center'>
            <div className='relative'>
              <PlayerImage
                player={{ profileImageUrl }}
                imageDimensions='w-28 h-28 md:w-28 md:h-28 border-success'
              />
              <div
                className='text-dodger-blue absolute bottom-0 right-1 bg-white p-2 rounded-full border-2 border-primary cursor-pointer'
                onClick={toggleUpdateProfileModal}
              >
                <FaPencilAlt size='12' />
              </div>
            </div>
            <h1 className='text-3xl md:text-4xl font-semibold my-2 text-secondary'>
              {firstName} {lastName}
            </h1>
            <p className='text-base md:text-lg '>{email}</p>

            <ProfileDetailsCard
              totalMatches={totalMatches}
              gamesWon={gamesWon}
              cleanSweaps={cleanSweaps}
              perfects={perfects}
            />
          </section>
        )}
      </GlassyCard>
      <UpdatePictureModal getLoggedInUser={getLoggedInUser} userEmail={email} />
    </MainLayout>
  );
};

export default Profile;
