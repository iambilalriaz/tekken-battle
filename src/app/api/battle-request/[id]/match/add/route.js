import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Match from '@/models/Match';
import BattleRequest from '@/models/BattleRequest';

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
          gamesWon: 1,
          cleanSweaps: cleanSweep ? 1 : 0,
          perfects:
            winner.toString() === player1 ? player1Perfects : player2Perfects,
        },
      }),
      User.findByIdAndUpdate(loser, {
        $inc: {
          perfects:
            loser.toString() === player1 ? player1Perfects : player2Perfects,
        },
      }),
      BattleRequest.findByIdAndUpdate(battleRequestId, {
        $push: { matches: match._id },
        $set: { status: 'in-match' },
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
