import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Match from '@/models/Match';

export async function GET(_req, { params }) {
  await dbConnect();

  const battleRequestId = params.id;

  if (!battleRequestId) {
    return NextResponse.json(
      { success: false, error: 'Battle request ID is required' },
      { status: 400 }
    );
  }

  try {
    const matches = await Match.find({ battleRequestId })
      .sort({ createdAt: -1 })
      .populate('player1', 'firstName lastName profileImageUrl')
      .populate('player2', 'firstName lastName profileImageUrl')
      .populate('winner', 'firstName lastName profileImageUrl')
      .populate('loser', 'firstName lastName profileImageUrl');

    const formatted = matches.map((match) => {
      const getPerfects = (playerField) =>
        match[playerField] && match[playerField]._id.equals(match.winner._id)
          ? match.player1Perfects
          : match.player2Perfects;

      return {
        id: match._id,
        createdAt: match.createdAt,
        winner: {
          name: `${match.winner.firstName} ${match.winner.lastName}`,
          profileImageUrl: match.winner.profileImageUrl,
          perfects: match.winner._id.equals(match.player1._id)
            ? match.player1Perfects
            : match.player2Perfects,
          cleanSweep: match.cleanSweep,
        },
        loser: {
          name: `${match.loser.firstName} ${match.loser.lastName}`,
          profileImageUrl: match.loser.profileImageUrl,
          perfects: match.loser._id.equals(match.player1._id)
            ? match.player1Perfects
            : match.player2Perfects,
        },
      };
    });

    return NextResponse.json({ success: true, data: formatted });
  } catch (err) {
    console.error('Error fetching matches:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}
