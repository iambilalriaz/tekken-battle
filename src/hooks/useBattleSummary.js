import { useBattleMatches } from '@/store/useBattleMatches';

export const useBattleSummary = () => {
  const { battleMatches } = useBattleMatches();

  const player1 = battleMatches?.[0]?.player1;
  const player2 = battleMatches?.[0]?.player2;

  const summary = {
    [player1?._id]: { wins: 0, perfects: 0, cleanSweeps: 0, player: player1 },
    [player2?._id]: { wins: 0, perfects: 0, cleanSweeps: 0, player: player2 },
  };
  battleMatches?.forEach((match) => {
    summary[match.winner].wins += 1;
    summary[match.player1._id].perfects += match.player1Perfects;
    summary[match.player2._id].perfects += match.player2Perfects;
    if (match.cleanSweep) summary[match.winner].cleanSweeps += 1;
  });

  const [dominantId, dominant] = Object.entries(summary).reduce((a, b) => {
    const aStats = a[1];
    const bStats = b[1];

    if (bStats.wins !== aStats.wins) {
      return bStats.wins > aStats.wins ? b : a;
    }

    if (bStats.perfects !== aStats.perfects) {
      return bStats.perfects > aStats.perfects ? b : a;
    }

    if (bStats.cleanSweeps !== aStats.cleanSweeps) {
      return bStats.cleanSweeps > aStats.cleanSweeps ? b : a;
    }

    return a; // fallback (e.g., first player)
  });
  return {
    battleMatches,
    dominantId,
    dominant,
    summary,
    player1: summary[dominantId === player1?._id ? player1?._id : player2?._id],
    player2: summary[dominantId === player1?._id ? player2?._id : player1?._id],
  };
};
