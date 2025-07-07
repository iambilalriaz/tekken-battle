import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongoose';
import Battle from '@/models/Battle';
import jwt from 'jsonwebtoken';
import { BATTLE_STATUSES } from '@/constants';

const JWT_SECRET = process.env.JWT_ACCESS_SECRET;

export async function GET(req) {
  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore?.get('accessToken')?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, data: null, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  let user;
  try {
    user = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return NextResponse.json(
      { success: false, data: null, error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  const playerId = user.userId;

  // Extract status from query param
  const { searchParams } = new URL(req.url);
  const statusQuery = searchParams.get('status');

  // Handle optional single or multiple status values
  const statusArray = statusQuery
    ? statusQuery.split(',') // e.g. status=REQUESTED,IN_MATCH
    : [BATTLE_STATUSES.REQUESTED, BATTLE_STATUSES.IN_MATCH];

  try {
    const battleRequests = await Battle.find({
      $and: [
        {
          $or: [{ 'requester.id': playerId }, { 'acceptor.id': playerId }],
        },
        {
          status: { $in: statusArray },
        },
      ],
    }).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: battleRequests, error: null },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, data: null, error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
