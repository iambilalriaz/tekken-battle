'use client';
import Button from '@/components/common/Button';
import MainLayout from '@/layouts/MainLayout';
import { IoMdAdd } from 'react-icons/io';
import MatchRecord from '@/components/matches/MatchRecord';
import { useEffect, useState } from 'react';
import MatchForm from '@/components/matches/MatchForm';
import { useNetworkRequest } from '@/hooks/useNetworkRequest';
import { fetchBattleMatchesAPI, getBattleDetailsAPI } from '@/lib/api';
import { useBattle } from '@/store/useBattle';
import Loader from '@/components/common/Loader';
import { useBattleMatches } from '@/store/useBattleMatches';
import { useParams, useRouter } from 'next/navigation';
import GlassyCard from '@/components/common/GlassyCard';
import FinishBattle from '@/components/FinishBattle';
import toast from 'react-hot-toast';
import { APP_ROUTES } from '@/constants/app-routes';
import Tabs from '@/components/common/Tabs';
import SummaryView from '@/components/matches/SummaryView';

const Battle = () => {
  const params = useParams();
  const router = useRouter();
  const battleId = params?.battleId;
  const { setBattle, toggleFinishBattleModal } = useBattle();
  const { setBattleMatches } = useBattleMatches();
  const [showAddMatchForm, setShowAddMatchForm] = useState(false);
  const toggleAddMatchForm = () => {
    setShowAddMatchForm((prevState) => !prevState);
  };

  const {
    loading: fetchingBattle,
    errorMessage: fetchingBattleError,
    executeFunction: getBattleDetails,
  } = useNetworkRequest({
    apiFunction: getBattleDetailsAPI,
    initialLoader: true,
  });
  const {
    data: matches,
    loading: fetchingBattleMatches,
    executeFunction: getBattleMatches,
  } = useNetworkRequest({
    apiFunction: fetchBattleMatchesAPI,
    initialLoader: !fetchingBattle,
  });

  const fetchBattleMatches = async () => {
    const response = await getBattleMatches(battleId);
    setBattleMatches(response);
  };

  const fetchBattleDetails = async () => {
    const response = await getBattleDetails(battleId);
    setBattle(response);
    await fetchBattleMatches();
  };
  useEffect(() => {
    if (battleId) {
      fetchBattleDetails();
    }
  }, [battleId]);
  useEffect(() => {
    if (fetchingBattleError) {
      toast.error(fetchingBattleError);
      setTimeout(() => {
        router.replace(APP_ROUTES.BATTLES.LIST);
      }, 1000);
    }
  }, [fetchingBattleError]);

  const tabData = [
    {
      label: 'Summary',
      content: <SummaryView matches={matches} />,
    },
    {
      label: 'List',
      content: (
        <>
          {matches?.map((match) => (
            <MatchRecord key={match?._id} match={match} />
          ))}
        </>
      ),
    },
  ];
  return (
    <MainLayout>
      {fetchingBattle || fetchingBattleMatches ? (
        <Loader size='xl' />
      ) : !matches?.length ? (
        <GlassyCard styles='md:min-w-100 !mt-0'>
          <p className='text-center'>
            There is no match added in this session. Let's add!
          </p>
        </GlassyCard>
      ) : (
        <>
          <div className='max-w-2xl mx-auto py-4'>
            <Tabs tabs={tabData} defaultActive={0} />
          </div>
        </>
      )}
      {fetchingBattle || fetchingBattleError ? null : (
        <div className='fixed px-2 right-0 w-full bottom-0 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-md py-2 flex justify-center items-center gap-2'>
          <Button
            variant='secondary'
            className='flex items-center justify-center gap-1 md:max-w-[240px] w-1/2 py-4 uppercase !font-bold'
            onClick={toggleAddMatchForm}
          >
            <IoMdAdd /> Add Match
          </Button>
          <Button
            variant='success'
            className='md:max-w-[240px] w-1/2 py-4 uppercase !font-bold'
            onClick={toggleFinishBattleModal}
          >
            Finish Battle
          </Button>
        </div>
      )}
      <MatchForm
        fetchBattleMatches={fetchBattleMatches}
        isOpen={showAddMatchForm}
        toggleModal={toggleAddMatchForm}
      />
      <FinishBattle />
    </MainLayout>
  );
};

export default Battle;
