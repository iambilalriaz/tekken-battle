import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Battle from '@/models/Battle';
import Match from '@/models/Match';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { BATTLE_STATUSES } from '../../../constants';

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
        { 'requester.id': currentUserId }, // fallback for embedded IDs
        { 'acceptor.id': currentUserId },
      ],
    };

    const battles = await Battle.find(battleQuery).populate('matches').lean(); // return plain JS objects

    const result = {
      opponent: null,
      totalMatches: 0,
      yourPerfects: 0,
      opponentPerfects: 0,
      yourCleanSweeps: 0,
      opponentCleanSweeps: 0,
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

      if (!result.opponent) {
        result.opponent = {
          id: thisOpponentId,
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

        result.totalMatches++;

        if (isPlayer1) {
          result.yourPerfects += match.player1Perfects || 0;
          result.opponentPerfects += match.player2Perfects || 0;
        } else {
          result.yourPerfects += match.player2Perfects || 0;
          result.opponentPerfects += match.player1Perfects || 0;
        }

        if (match.cleanSweep) {
          if (winnerId === currentUserId) {
            result.yourCleanSweeps++;
          } else {
            result.opponentCleanSweeps++;
          }
        }
      }
    }

    return NextResponse.json({ data: result.opponent ? result : null });
  } catch (error) {
    console.error('Dashboard Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
