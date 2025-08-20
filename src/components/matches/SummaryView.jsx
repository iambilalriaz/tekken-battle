import { useBattleSummary } from '@/hooks/useBattleSummary';
import PlayerImage from '@/components/matches/PlayerImage';
import clsx from 'clsx';
import StatsBox from '@/components/StatsBox';

const SummaryView = ({ matches }) => {
  const { battleMatches, dominantId, player1, player2 } = useBattleSummary();

  const player1Details =
    player1?.player?._id === dominantId ? player1?.player : player2?.player;
  const player2Details =
    player1?.player?._id === dominantId ? player2?.player : player1?.player;

  return (
    <div className='text-sm animate__animated animate__backInDown animate__faster'>
      <div className='grid grid-cols-3 place-items-center py-4'>
        <div className='mx-4'>
          <PlayerImage
            player={player1Details}
            imageDimensions={clsx('w-20 h-20 md:w-32 md:h-32')}
            displayName={false}
            isWinner={player1Details._id === dominantId}
          />
          <p className='text-center mt-2'>{player1Details.firstName}</p>
        </div>
        <img
          src='/vs.png'
          className='w-16 h-16 md:w-20 md:h-20 col-span-1'
          alt='vs'
        />
        <div className='mx-4'>
          <PlayerImage
            player={player2Details}
            imageDimensions={clsx('w-20 h-20 md:w-32 md:h-32')}
            displayName={false}
            isWinner={player2Details._id === dominantId}
          />
          <p className='text-center mt-2'>{player2Details.firstName}</p>
        </div>
      </div>
      <h1 className='text-center bg-white text-primary font-bold p-2 rounded-2xl'>
        Total Matches: {matches?.length}
      </h1>
      <StatsBox
        statLabel='Wins'
        firstValue={player1?.wins}
        secondValue={player2?.wins}
      />
      <StatsBox
        statLabel='Perfects'
        firstValue={player1?.perfects}
        secondValue={player2?.perfects}
      />
      <StatsBox
        statLabel='Clean Sweeps'
        firstValue={player1?.cleanSweeps}
        secondValue={player2?.cleanSweeps}
      />
      <StatsBox
        statLabel='Win %'
        firstValue={Math.round((player1.wins / battleMatches?.length) * 100)}
        secondValue={Math.round((player2.wins / battleMatches?.length) * 100)}
      />
    </div>
  );
};

export default SummaryView;
