import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Match from '@/models/Match';
import Battle from '@/models/Battle';
import { BATTLE_STATUSES } from '@/constants';

export async function POST(req, { params }) {
  await dbConnect();

  const battleRequestId = params.id;

  try {
    const {
      player1,
      player2,
      winner,
      loser,
      player1Perfects,
      player2Perfects,
      cleanSweep,
    } = await req.json();

    if (!player1 || !player2 || !winner || !loser) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch and validate battle
    const battle = await Battle.findById(battleRequestId);

    if (!battle) {
      return NextResponse.json(
        { success: false, error: 'Battle not found' },
        { status: 404 }
      );
    }

    if (battle.status !== BATTLE_STATUSES.IN_MATCH) {
      return NextResponse.json(
        { success: false, error: 'Cannot add match to a non-active battle' },
        { status: 400 }
      );
    }

    // Create the match
    const match = await Match.create({
      player1,
      player2,
      winner,
      loser,
      player1Perfects,
      player2Perfects,
      cleanSweep,
      battleRequestId,
    });

    // Update user stats
    const updates = [
      User.findByIdAndUpdate(winner, {
        $inc: {
          totalMatches: 1,
          gamesWon: 1,
          cleanSweaps: cleanSweep ? 1 : 0,
          perfects:
            winner.toString() === player1 ? player1Perfects : player2Perfects,
        },
      }),
      User.findByIdAndUpdate(loser, {
        $inc: {
          totalMatches: 1,

          perfects:
            loser.toString() === player1 ? player1Perfects : player2Perfects,
        },
      }),
      Battle.findByIdAndUpdate(battleRequestId, {
        $push: { matches: match._id },
      }),
    ];

    await Promise.all(updates);

    return NextResponse.json({ success: true, data: match });
  } catch (err) {
    console.error('Match creation error:', err);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
