import Match from '@/models/Match';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';

export async function GET(req, { params }) {
  await dbConnect();
  const battleRequestId = params?.id;

  try {
    const matches = await Match.find({ battleRequestId })
      .populate('player1', '_id firstName lastName profileImage')
      .populate('player2', '_id firstName lastName profileImage')
      .lean();

    const enhancedMatches = matches.map((match) => ({
      _id: match._id,
      player1: match.player1,
      player2: match.player2,
      winner: match.winner,
      loser: match.loser,
      player1Perfects: match.player1Perfects,
      player2Perfects: match.player2Perfects,
      cleanSweep: match.cleanSweep,
      createdAt: match.createdAt,
    }));

    return NextResponse.json(
      { success: true, data: enhancedMatches },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
