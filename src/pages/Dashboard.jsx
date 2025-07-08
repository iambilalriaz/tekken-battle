'use client';

import Loader from '@/components/common/Loader';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import MainLayout from '@/layouts/MainLayout';
import { useCallback, useEffect } from 'react';
import { useNetworkRequest } from '@/hooks/useNetworkRequest';
import { fetchAllUsersAPI, fetchDashboardDataAPI } from '@/lib/api';
import { useDashboardStats } from '@/store/useDashboardStats';

import { useToggleComparisonModal } from '@/store/useToggleComparisonModal';
import SelectOpponentFilterModal from '@/components/SelectOpponentFilterModal';
import DashboardFilters from '@/components/DashboardFilters';
import toast from 'react-hot-toast';
import { useAllUsers } from '@/store/useAllUsers';
import dayjs from 'dayjs';
import PlayerComparisonSummary from '@/components/PlayerComparisonSummary';
import GlassyCard from '@/components/common/GlassyCard';
import Button from '@/components/common/Button';
import { useSelectOpponentModal } from '@/store/useSelectOpponentModal';
import SelectYourOpponent from '@/components/SelectYourOpponent';
import { useExportImage } from '@/hooks/useExportImage';
import { getAccessToken } from '../lib/helpers';

const Dashboard = () => {
  const { loggedInUser } = useLoggedInUser();
  const accessToken = getAccessToken();
  const { setAllUsers } = useAllUsers();
  const { toggleOpponentSelectionModal } = useSelectOpponentModal();

  const { comparisonModal, selectedOpponent, setSelectedOpponent } =
    useToggleComparisonModal();
  const { statsDate, setDashboardStats } = useDashboardStats();

  const { loading: fetchingUsers, executeFunction: fetchAllUsers } =
    useNetworkRequest({ apiFunction: fetchAllUsersAPI, initialLoader: true });

  const {
    data: dashboardStats,
    loading: fetchingStats,
    errorMessage: fetchingStatusError,
    executeFunction: fetchStats,
  } = useNetworkRequest({ apiFunction: fetchDashboardDataAPI });
  const formattedDate = dayjs(statsDate).format('YYYY-MM-DD');

  const { componentRef, handleExport, isExporting } = useExportImage({
    imageName: `tekken-battle-${formattedDate}`,
  });

  useEffect(() => {
    if (fetchingStatusError) {
      toast.error(fetchingStatusError);
    }
  }, [fetchingStatusError]);

  const fetchUsers = useCallback(async () => {
    if (accessToken) {
      const users = await fetchAllUsers();
      setAllUsers(users);
      setSelectedOpponent(users?.[0]?.userId);
    }
  }, []);

  const fetchDashboardStats = async () => {
    if (statsDate && selectedOpponent) {
      const stats = await fetchStats({
        date: formattedDate,
        opponentId: selectedOpponent,
      });
      setDashboardStats(stats);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [statsDate, selectedOpponent]);

  return (
    <MainLayout>
      {fetchingUsers || fetchingStats ? (
        <Loader />
      ) : (
        <div className='bg-whte h- w-full'>
          <DashboardFilters
            handleExport={handleExport}
            isExporting={isExporting}
          />
          <div>
            {dashboardStats ? (
              <div ref={componentRef}>
                <PlayerComparisonSummary
                  data={dashboardStats}
                  currentUser={{
                    id: loggedInUser?.id,
                    name: `${loggedInUser?.firstName} ${loggedInUser?.lastName}`,
                    profileImage: loggedInUser?.profileImageUrl,
                  }}
                />
              </div>
            ) : (
              <GlassyCard styles='max-w-sm mx-auto'>
                <p className='flex justify-center items-center max-w-sm text-center mx-auto'>
                  No match statistics available for the selected date or
                  opponent. Try changing your filters to view past battle
                  records.
                </p>
              </GlassyCard>
            )}
          </div>
        </div>
      )}
      {comparisonModal && <SelectOpponentFilterModal />}
      <SelectYourOpponent />
      <div className='pb-24' />
      <div className='fixed px-2 right-0 w-full bottom-0 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-md py-2 flex justify-center items-center gap-2'>
        <Button
          variant='secondary'
          className='flex items-center justify-center gap-1 md:max-w-[240px] w-full py-4 uppercase !font-bold'
          onClick={toggleOpponentSelectionModal}
        >
          Challenge a Friend
        </Button>
      </div>
      <style>{`
      .react-datepicker-wrapper, .react-datepicker__input-container {
        width: 100%;
      }
      `}</style>
    </MainLayout>
  );
};
export default Dashboard;
