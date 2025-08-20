import { fetchAllUsersAPI } from '@/lib/api';
import { useAllUsers } from '@/store/useAllUsers';
import Loader from '@/components/common/Loader';
import { useCallback, useEffect } from 'react';
import { useNetworkRequest } from '@/hooks/useNetworkRequest';
import GlassyModal from './common/GlassyModal';

const SelectOpponent = ({
  loaderComponent = null,
  onSelectOpponent,
  initialLoader = false,
  showModal,
  toggleModal,
}) => {
  const { allUsers, setAllUsers } = useAllUsers();

  const { loading: fetchingUsers, executeFunction: fetchAllUsers } =
    useNetworkRequest({ apiFunction: fetchAllUsersAPI, initialLoader });
  const fetchUsers = useCallback(async () => {
    const users = await fetchAllUsers();
    setAllUsers(users);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <GlassyModal
      isOpen={showModal}
      onClose={toggleModal}
      title='Select Your Opponent'
    >
      {loaderComponent ? (
        loaderComponent
      ) : fetchingUsers ? (
        <div className='p-12'>
          <Loader />
        </div>
      ) : allUsers?.length ? (
        allUsers?.map((user) => (
          <div
            key={user?.userId}
            className='flex items-center hover:bg-gray/20 active:bg-gray/20 cursor-pointer p-2 select-none animate__animated animate__rollIn animate__faster'
            onClick={() => onSelectOpponent(user?.userId)}
          >
            <div className='w-10 h-10 rounded-full overflow-hidden border-4 border-white'>
              <img src={user?.profileImage} width={50} height={50} />
            </div>
            <p className='font-semibold ml-3'>{user?.name}</p>
          </div>
        ))
      ) : (
        <p className='flex justify-center items-center max-w-sm text-center mx-auto'>
          Looks like you don’t have any opponents yet.
        </p>
      )}
    </GlassyModal>
  );
};

export default SelectOpponent;
