'use client';
import Button from '@/components/common/Button';
import MainLayout from '@/layouts/MainLayout';
import { IoMdAdd } from 'react-icons/io';
import MatchRecord from '../components/MatchRecord';
import { useEffect, useState } from 'react';
import MatchForm from '../components/MatchForm';
import { useNetworkRequest } from '../hooks/useNetworkRequest';
import { fetchBattleMatchesAPI, getBattleDetailsAPI } from '../lib/api';
import { useParams } from 'next/navigation';
import { useBattle } from '../store/useBattle';
import Loader from '../components/common/Loader';
import { useBattleMatches } from '../store/useBattleMatches';

const Battle = () => {
  const { battleId } = useParams();
  const { setBattle } = useBattle();
  const { setBattleMatches } = useBattleMatches();
  const [showAddMatchForm, setShowAddMatchForm] = useState(false);
  const toggleAddMatchForm = () => {
    setShowAddMatchForm((prevState) => !prevState);
  };

  const {
    loading: fetchingBattle,
    errorMessage,
    executeFunction: getBattleDetails,
  } = useNetworkRequest({
    apiFunction: getBattleDetailsAPI,
  });
  const { loading: fetchingBattleMatches, executeFunction: getBattleMatches } =
    useNetworkRequest({
      apiFunction: fetchBattleMatchesAPI,
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
    fetchBattleDetails();
  }, [battleId]);
  return (
    <MainLayout>
      {fetchingBattle ? (
        <Loader size='xl' />
      ) : (
        <div>
          {/* <GlassyCard styles='md:min-w-100 !mt-0'>
          <p className='text-center'>
            There is no match added in this session. Let's add!
          </p>
        </GlassyCard> */}
          <div className='bg-hite rounded-4xl max-h-[90dvh] py-12 overflow-y-auto'>
            <MatchRecord />
            <MatchRecord />
            <MatchRecord />
            <MatchRecord />
            <MatchRecord />
            <MatchRecord />
          </div>
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
            >
              Finish Battle
            </Button>
          </div>
        </div>
      )}

      <MatchForm
        fetchBattleMatches={fetchBattleMatches}
        isOpen={showAddMatchForm}
        toggleModal={toggleAddMatchForm}
      />
    </MainLayout>
  );
};

export default Battle;
