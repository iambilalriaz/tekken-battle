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
import { useParams } from 'next/navigation';
import GlassyCard from '@/components/common/GlassyCard';
import FinishBattle from '../components/FinishBattle';

const Battle = () => {
  const params = useParams();
  const battleId = params?.battleId;
  const { setBattle, toggleFinishBattleModal } = useBattle();
  const { setBattleMatches } = useBattleMatches();
  const [showAddMatchForm, setShowAddMatchForm] = useState(false);
  const toggleAddMatchForm = () => {
    setShowAddMatchForm((prevState) => !prevState);
  };

  const { loading: fetchingBattle, executeFunction: getBattleDetails } =
    useNetworkRequest({
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
          <div className='rounded-4xl w-full max-w-lg pb-20'>
            {matches?.map((match) => (
              <MatchRecord key={match?._id} match={match} />
            ))}
          </div>
        </>
      )}
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
