'use client';
import GlassyCard from '@/components/common/GlassyCard';
import PlayerCard from '@/components/matches/PlayerCard';
import CleanSweepBadge from '@/components/matches/CleanSweepBadge';

const MatchRecord = ({ match }) => {
  const {
    player1,
    player2,
    winner,
    player1Perfects,
    player2Perfects,
    cleanSweep,
  } = match;

  const isPlayer1Winner = winner === player1?._id;

  const leftPlayer = isPlayer1Winner ? player1 : player2;
  const rightPlayer = isPlayer1Winner ? player2 : player1;
  const leftPerfects = isPlayer1Winner ? player1Perfects : player2Perfects;
  const rightPerfects = isPlayer1Winner ? player2Perfects : player1Perfects;

  return (
    <GlassyCard
      styles='animate__animated animate__rollIn'
      cardStyles='bg-black/40'
    >
      <div className='flex items-center flex-row max-[380px]:flex-col justify-between gap-2 md:gap-6 w-full '>
        <PlayerCard player={leftPlayer} perfects={leftPerfects} isWinner />
        <p className='bg-black/30 text-white text-xs md:text-sm text-center px-3 py-1 rounded-full font-bold'>
          Match Result
        </p>
        <PlayerCard player={rightPlayer} perfects={rightPerfects} />
      </div>
      <CleanSweepBadge cleanSweep={cleanSweep} />
    </GlassyCard>
  );
};

export default MatchRecord;
