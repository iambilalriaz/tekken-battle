import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Battle from '@/models/Battle';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { BATTLE_STATUSES } from '@/constants';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { date, opponentId } = body;

    if (!date || !opponentId) {
      return NextResponse.json(
        { error: 'Both date and opponentId are required' },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let user;
    try {
      user = jwt.verify(token, JWT_ACCESS_SECRET);
    } catch {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const currentUserId = user.userId;

    // Setup date filter
    const parsedDate = new Date(date);
    const start = new Date(parsedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(parsedDate);
    end.setHours(23, 59, 59, 999);

    const battleQuery = {
      createdAt: { $gte: start, $lte: end },
      status: BATTLE_STATUSES.FINISHED,
      $or: [
        { 'requester._id': currentUserId },
        { 'acceptor._id': currentUserId },
        { 'requester.id': currentUserId },
        { 'acceptor.id': currentUserId },
      ],
    };

    const battles = await Battle.find(battleQuery).populate('matches').lean();

    let totalMatches = 0;
    let yourWins = 0;
    let opponentWins = 0;
    let yourPerfects = 0;
    let opponentPerfects = 0;
    let yourCleanSweeps = 0;
    let opponentCleanSweeps = 0;

    let opponentInfo = null;
    let currentUserInfo = {
      name: user.name || 'You',
      profileImage: user.profileImageUrl || '',
    };

    for (const battle of battles) {
      const requesterId =
        battle.requester?.id?.toString() || battle.requester?._id?.toString();
      const acceptorId =
        battle.acceptor?.id?.toString() || battle.acceptor?._id?.toString();

      const isCurrentUserRequester = requesterId === currentUserId;
      const isCurrentUserAcceptor = acceptorId === currentUserId;

      if (!isCurrentUserRequester && !isCurrentUserAcceptor) continue;

      const opponent = isCurrentUserRequester
        ? battle.acceptor
        : battle.requester;
      const thisOpponentId =
        opponent?.id?.toString() || opponent?._id?.toString();

      if (!thisOpponentId || thisOpponentId !== opponentId) continue;

      if (!opponentInfo) {
        opponentInfo = {
          name: opponent?.name || '',
          profileImage: opponent?.profileImage || '',
        };
      }

      for (const match of battle.matches || []) {
        if (!match) continue;

        const player1Id = match.player1?.toString();
        const player2Id = match.player2?.toString();
        const winnerId = match.winner?.toString();

        const isPlayer1 = player1Id === currentUserId;
        const isPlayer2 = player2Id === currentUserId;

        if (!isPlayer1 && !isPlayer2) continue;

        totalMatches++;

        const youWon = winnerId === currentUserId;
        const opponentWon = winnerId === opponentId;

        if (youWon) yourWins++;
        if (opponentWon) opponentWins++;

        if (isPlayer1) {
          yourPerfects += match.player1Perfects || 0;
          opponentPerfects += match.player2Perfects || 0;
        } else {
          yourPerfects += match.player2Perfects || 0;
          opponentPerfects += match.player1Perfects || 0;
        }

        if (match.cleanSweep) {
          if (youWon) {
            yourCleanSweeps++;
          } else if (opponentWon) {
            opponentCleanSweeps++;
          }
        }
      }
    }

    if (!opponentInfo || totalMatches === 0) {
      return NextResponse.json({ data: null });
    }

    let winner, loser;
    let isDraw = false;

    if (yourWins > opponentWins) {
      winner = {
        ...currentUserInfo,
        perfects: yourPerfects,
        cleanSweeps: yourCleanSweeps,
        winCount: yourWins,
        winPercentage: Math.round((yourWins / totalMatches) * 100),
      };
      loser = {
        ...opponentInfo,
        perfects: opponentPerfects,
        cleanSweeps: opponentCleanSweeps,
        winCount: opponentWins,
        winPercentage: Math.round((opponentWins / totalMatches) * 100),
      };
    } else if (opponentWins > yourWins) {
      winner = {
        ...opponentInfo,
        perfects: opponentPerfects,
        cleanSweeps: opponentCleanSweeps,
        winCount: opponentWins,
        winPercentage: Math.round((opponentWins / totalMatches) * 100),
      };
      loser = {
        ...currentUserInfo,
        perfects: yourPerfects,
        cleanSweeps: yourCleanSweeps,
        winCount: yourWins,
        winPercentage: Math.round((yourWins / totalMatches) * 100),
      };
    } else {
      isDraw = true;
      winner = {
        ...currentUserInfo,
        perfects: yourPerfects,
        cleanSweeps: yourCleanSweeps,
        winCount: yourWins,
        winPercentage: Math.round((yourWins / totalMatches) * 100),
      };
      loser = {
        ...opponentInfo,
        perfects: opponentPerfects,
        cleanSweeps: opponentCleanSweeps,
        winCount: opponentWins,
        winPercentage: Math.round((opponentWins / totalMatches) * 100),
      };
    }

    return NextResponse.json({
      data: {
        totalMatches,
        isDraw,
        winner,
        loser,
      },
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
