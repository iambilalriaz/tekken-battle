import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Match from '@/models/Match';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // Fetch all matches sorted by creation date with populated fields
    const matches = await Match.find()
      .sort({ createdAt: 1 })
      .populate('winner', 'firstName lastName profileImageUrl')
      .populate('loser', 'firstName lastName profileImageUrl')
      .lean();

    if (matches.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: null,
          message: 'No matches found',
        },
        { status: 200 }
      );
    }

    // Group matches by date and calculate consecutive wins for each day
    const dailyMatches = new Map();

    matches.forEach((match) => {
      const matchDate = new Date(match.createdAt).toDateString();
      if (!dailyMatches.has(matchDate)) {
        dailyMatches.set(matchDate, []);
      }
      dailyMatches.get(matchDate).push(match);
    });

    let globalMaxRecord = null;
    let globalMaxStreak = 0;

    // Process each day's matches
    dailyMatches.forEach((dayMatches, date) => {
      const playerStreaks = new Map();

      dayMatches.forEach((match) => {
        const winnerId = match.winner._id.toString();
        const loserId = match.loser._id.toString();

        // Initialize winner streak if not exists
        if (!playerStreaks.has(winnerId)) {
          playerStreaks.set(winnerId, {
            currentStreak: 0,
            maxStreak: 0,
            playerInfo: {
              firstName: match.winner.firstName,
              lastName: match.winner.lastName,
              profileImageUrl: match.winner.profileImageUrl,
            },
            opponentId: null,
            opponentInfo: null,
            matchDate: match.createdAt,
          });
        }

        // Initialize loser streak if not exists
        if (!playerStreaks.has(loserId)) {
          playerStreaks.set(loserId, {
            currentStreak: 0,
            maxStreak: 0,
            playerInfo: {
              firstName: match.loser.firstName,
              lastName: match.loser.lastName,
              profileImageUrl: match.loser.profileImageUrl,
            },
            opponentId: null,
            opponentInfo: null,
            matchDate: match.createdAt,
          });
        }

        const winnerStreak = playerStreaks.get(winnerId);
        const loserStreak = playerStreaks.get(loserId);

        // Increment winner's current streak
        winnerStreak.currentStreak++;

        // Store opponent info for the winner
        winnerStreak.opponentId = loserId;
        winnerStreak.opponentInfo = {
          firstName: match.loser.firstName,
          lastName: match.loser.lastName,
          profileImageUrl: match.loser.profileImageUrl,
        };
        winnerStreak.matchDate = match.createdAt;

        // Update max streak if current is higher
        if (winnerStreak.currentStreak > winnerStreak.maxStreak) {
          winnerStreak.maxStreak = winnerStreak.currentStreak;
        }

        // Reset loser's current streak
        loserStreak.currentStreak = 0;
      });

      // Find the max streak for this day
      playerStreaks.forEach((streak, playerId) => {
        if (streak.maxStreak > globalMaxStreak && streak.playerInfo) {
          globalMaxStreak = streak.maxStreak;
          globalMaxRecord = {
            playerId,
            playerName: `${streak.playerInfo.firstName} ${streak.playerInfo.lastName}`,
            playerImage: streak.playerInfo.profileImageUrl,
            opponentName: streak.opponentInfo
              ? `${streak.opponentInfo.firstName} ${streak.opponentInfo.lastName}`
              : 'Unknown',
            opponentImage: streak.opponentInfo?.profileImageUrl || null,
            consecutiveWins: streak.maxStreak,
            recordDate: streak.matchDate,
          };
        }
      });
    });

    return NextResponse.json(
      {
        success: true,
        data: globalMaxRecord,
        message: globalMaxRecord
          ? 'Most consecutive wins record fetched successfully'
          : 'No record found',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching most consecutive wins:', error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: 'Failed to fetch most consecutive wins record',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
