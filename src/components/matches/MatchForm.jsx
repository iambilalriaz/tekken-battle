'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import GlassyModal from '../common/GlassyModal';
import FloatingSelect from '../common/FloatingSelect';
import CounterInput from '../common/CounterInput';
import { useBattle } from '../../store/useBattle';
import Button from '../common/Button';
import { useNetworkRequest } from '../../hooks/useNetworkRequest';
import Loader from '../common/Loader';
import { addNewMatchAPI } from '../../lib/api';
import toast from 'react-hot-toast';

const MatchForm = ({ isOpen, toggleModal, fetchBattleMatches }) => {
  const { battle } = useBattle();
  const { requester, acceptor } = battle ?? {};

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    resetField,
    formState: { errors },
  } = useForm();

  const {
    loading: addingMatch,

    errorMessage,
    executeFunction: addNewMatch,
  } = useNetworkRequest({ apiFunction: addNewMatchAPI });

  const winner = watch('winner');
  const player1Perfects = watch('player1Perfects') || 0;
  const player2Perfects = watch('player2Perfects') || 0;
  const cleanSweep = watch('cleanSweep') || false;

  useEffect(() => {
    resetField('player1Perfects');
    resetField('player2Perfects');
  }, [winner]);
  useEffect(() => {
    if (cleanSweep && player1Perfects && player2Perfects) {
      resetField('cleanSweep');
    }
  }, [player1Perfects, player2Perfects]);

  const submitForm = async (data) => {
    const winnerId = data.winner;
    const loserId = winnerId === requester?.id ? acceptor?.id : requester?.id;

    // Basic validations
    if (winnerId === requester?.id && player2Perfects > 1) {
      return toast.error(
        `${acceptor?.name} can't have more than 1 perfect round if they lost`
      );
    }
    if (winnerId === acceptor?.id && player1Perfects > 1) {
      return toast.error(
        `${requester?.name} can't have more than 1 perfect round if they lost`
      );
    }

    if (cleanSweep) {
      if (winnerId === requester?.id && player2Perfects > 0) {
        return toast.error(
          `${acceptor?.name} can't have perfect rounds if ${requester?.name} won by clean sweep`
        );
      }
      if (winnerId === acceptor?.id && player1Perfects > 0) {
        return toast.error(
          `${requester?.name} can't have perfect rounds if ${acceptor?.name} won by clean sweep`
        );
      }
    }

    const payload = {
      player1: requester?.id,
      player2: acceptor?.id,
      winner: winnerId,
      loser: loserId,
      player1Perfects,
      player2Perfects,
      cleanSweep,
    };
    await addNewMatch(battle?._id, payload);
    toast.success('Match added ✅.');
    reset();
    toggleModal();
    await fetchBattleMatches();
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);
  useEffect(() => () => reset(), [isOpen]);

  return (
    <GlassyModal isOpen={isOpen} onClose={toggleModal} title='Add Match'>
      <div className='animate__animated animate__lightSpeedInLeft'>
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
          <p className='text-sm text-error'>{errors.winner.message}</p>
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
              max={3 - player2Perfects}
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
              max={3 - player1Perfects}
              classes='my-4'
            />
          )}
        />

        {errors.player2Perfects && (
          <p className='text-sm text-error'>{errors.player2Perfects.message}</p>
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
      </div>
    </GlassyModal>
  );
};

export default MatchForm;
