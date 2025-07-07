import clsx from 'clsx';

const ProfileDetailsCard = ({
  totalMatches = 0,
  gamesWon = 0,
  cleanSweaps = 0,
  perfects = 0,
  className = '',
}) => {
  const winRate =
    totalMatches > 0 ? ((gamesWon / totalMatches) * 100).toFixed(1) : '0';

  const stats = [
    { label: 'Total Matches', value: totalMatches },
    { label: 'Wins', value: gamesWon },
    { label: 'Win Rate', value: `${winRate}%` },
    { label: 'Perfects', value: perfects },
    { label: 'Clean Sweeps', value: cleanSweaps },
  ];

  return (
    <div
      className={clsx(
        'grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md shadow-md',
        className
      )}
    >
      {stats.map((stat) => (
        <div key={stat.label} className='text-center'>
          <p className='text-xl font-bold text-secondary'>{stat.value}</p>
          <p className='text-sm text-white'>{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileDetailsCard;
