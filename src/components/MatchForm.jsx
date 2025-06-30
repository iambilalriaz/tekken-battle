'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import GlassyModal from './common/GlassyModal';
import FloatingSelect from './common/FloatingSelect';
import CounterInput from './common/CounterInput';
import { useBattle } from '../store/useBattle';
import Button from './common/Button';
import { useNetworkRequest } from '../hooks/useNetworkRequest';
import Loader from './common/Loader';
import { addNewMatchAPI } from '../lib/api';
import toast from 'react-hot-toast';

const MatchForm = ({ isOpen, toggleModal, fetchBattleMatches }) => {
  const { battle } = useBattle();
  const { requester, acceptor } = battle ?? {};

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const {
    loading: addingMatch,
    errorMessage,
    executeFunction: addNewMatch,
  } = useNetworkRequest({ apiFunction: addNewMatchAPI });

  const submitForm = async (data) => {
    data.loser = data.winner === requester?.id ? acceptor?.id : requester?.id;
    const { winner, loser, player1Perfects, player2Perfects, cleanSweep } =
      data;
    const paylod = {
      player1: requester?.id,
      player2: acceptor?.id,
      winner: winner,
      loser: loser,
      player1Perfects,
      player2Perfects,
      cleanSweep: player1Perfects && player2Perfects ? false : cleanSweep,
    };

    await addNewMatch(battle?._id, paylod);
    toast.success('Match added ✅.');

    toggleModal();
    await fetchBattleMatches();
  };
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);
  return (
    <GlassyModal isOpen={isOpen} onClose={toggleModal} title='Add Match'>
      <FloatingSelect
        name='winner'
        label='Match Winner'
        options={[
          { label: requester?.name, value: requester?.id },
          { label: acceptor?.name, value: acceptor?.id },
        ]}
        {...register('winner', { required: 'Winner is required' })}
      />
      {errors.winner && (
        <p className='text-sm text-red-500'>{errors.winner.message}</p>
      )}

      <Controller
        name='player1Perfects'
        control={control}
        defaultValue={0}
        render={({ field }) => (
          <CounterInput
            {...field}
            label={`${requester?.name} Perfect Rounds`}
            classes='my-4'
            min={0}
            max={3 - watch('player2Perfects')}
          />
        )}
      />
      <Controller
        name='player2Perfects'
        control={control}
        defaultValue={0}
        render={({ field }) => (
          <CounterInput
            {...field}
            label={`${acceptor?.name} Perfect Rounds`}
            min={0}
            max={3 - watch('player1Perfects')}
            classes='my-4'
          />
        )}
      />

      {errors.player2Perfects && (
        <p className='text-sm text-red-500'>{errors.player2Perfects.message}</p>
      )}

      <div className='flex items-center gap-2'>
        <input
          id='cleanSweep'
          type='checkbox'
          className='h-5 w-5 accent-secondary cursor-pointer my-4'
          {...register('cleanSweep')}
          disabled={watch('player1Perfects') && watch('player2Perfects')}
          readOnly={watch('player1Perfects') && watch('player2Perfects')}
        />
        <label
          htmlFor='cleanSweep'
          className='text-sm font-medium cursor-pointer'
        >
          Clean Sweep (Winner won all rounds)
        </label>
      </div>
      {addingMatch ? (
        <div className='mt-8'>
          <Loader />
        </div>
      ) : (
        <Button
          className='mt-8 mx-auto w-full md:w-1/2 flex justify-center'
          onClick={handleSubmit(submitForm)}
        >
          Add
        </Button>
      )}
    </GlassyModal>
  );
};

export default MatchForm;
