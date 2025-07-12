import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongoose';
import Match from '@/models/Match';
import User from '@/models/User';
import { getAccessTokenFromHeaders } from '@/lib/helpers';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export async function POST(req) {
  await dbConnect();

  const token = getAccessTokenFromHeaders(req);

  if (!token) {
    return NextResponse.json(
      { success: false, data: null, error: 'Unauthorized: No token found' },
      { status: 401 }
    );
  }

  let user;
  try {
    user = jwt.verify(token, JWT_ACCESS_SECRET);
  } catch (err) {
    return NextResponse.json(
      { success: false, data: null, error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  const currentUserId = user?.userId;

  const userExists = await User.findById(currentUserId);
  if (!userExists) {
    return NextResponse.json(
      { error: 'Unauthorized: User no longer exists.' },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { opponentId } = body;

  if (!opponentId) {
    return NextResponse.json(
      { success: false, data: null, error: 'Opponent ID is required' },
      { status: 400 }
    );
  }

  const opponentExists = await User.findById(opponentId);
  if (!opponentExists) {
    return NextResponse.json(
      { error: 'Opponent does not exist.' },
      { status: 404 }
    );
  }

  try {
    const matches = await Match.find({
      $or: [
        { player1: currentUserId, player2: opponentId },
        { player1: opponentId, player2: currentUserId },
      ],
    });

    const totalMatches = matches.length;

    let userStats = {
      winCount: 0,
      perfects: 0,
      cleanSweeps: 0,
    };

    let opponentStats = {
      winCount: 0,
      perfects: 0,
      cleanSweeps: 0,
    };

    for (const match of matches) {
      const isUserWinner = match.winner.toString() === currentUserId;
      const isOpponentWinner = match.winner.toString() === opponentId;

      if (isUserWinner) userStats.winCount += 1;
      if (isOpponentWinner) opponentStats.winCount += 1;

      if (match.player1.toString() === currentUserId) {
        userStats.perfects += match.player1Perfects;
        opponentStats.perfects += match.player2Perfects;
      } else {
        userStats.perfects += match.player2Perfects;
        opponentStats.perfects += match.player1Perfects;
      }

      if (match.cleanSweep) {
        if (isUserWinner) userStats.cleanSweeps += 1;
        if (isOpponentWinner) opponentStats.cleanSweeps += 1;
      }
    }

    let draw = false;
    let winnerId = null;

    if (userStats.winCount > opponentStats.winCount) {
      winnerId = currentUserId;
    } else if (userStats.winCount < opponentStats.winCount) {
      winnerId = opponentId;
    } else {
      // Tie-breaker: compare perfects
      if (userStats.perfects > opponentStats.perfects) {
        winnerId = currentUserId;
      } else if (userStats.perfects < opponentStats.perfects) {
        winnerId = opponentId;
      } else {
        // Tie-breaker: compare clean sweeps
        if (userStats.cleanSweeps > opponentStats.cleanSweeps) {
          winnerId = currentUserId;
        } else if (userStats.cleanSweeps < opponentStats.cleanSweeps) {
          winnerId = opponentId;
        } else {
          draw = true;
        }
      }
    }

    const userWinPercentage = totalMatches
      ? Math.round((userStats.winCount / totalMatches) * 100)
      : 0;
    const opponentWinPercentage = totalMatches
      ? Math.round((opponentStats.winCount / totalMatches) * 100)
      : 0;

    const [userDoc, opponentDoc] = await Promise.all([
      User.findById(currentUserId).select('firstName lastName profileImageUrl'),
      User.findById(opponentId).select('firstName lastName profileImageUrl'),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          totalMatches,
          isDraw: draw,
          winnerId,
          player1: {
            id: userDoc._id,
            name: `${userDoc.firstName} ${userDoc.lastName}`,
            profileImage: userDoc.profileImageUrl || '',
            ...userStats,
            winPercentage: userWinPercentage,
          },
          player2: {
            id: opponentDoc._id,
            name: `${opponentDoc.firstName} ${opponentDoc.lastName}`,
            profileImage: opponentDoc.profileImageUrl || '',
            ...opponentStats,
            winPercentage: opponentWinPercentage,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Head-to-head stats error:', error);
    return NextResponse.json(
      { success: false, data: null, error: 'Server error' },
      { status: 500 }
    );
  }
}
