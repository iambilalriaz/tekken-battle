import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Battle from '@/models/Battle';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_ACCESS_SECRET;

export async function GET(req, context) {
  const params = context.params;
  const id = params.id;

  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  let user;
  try {
    user = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Battle request ID is required' },
      { status: 400 }
    );
  }

  try {
    const battle = await Battle.findById(id);

    if (!battle) {
      return NextResponse.json(
        { success: false, error: 'Battle request not found' },
        { status: 404 }
      );
    }

    const playerId = user.userId;
    const isUserParticipant =
      battle?.requester?.id?.toString() === playerId ||
      battle?.acceptor?.id?.toString() === playerId;

    if (!isUserParticipant) {
      return NextResponse.json(
        {
          success: false,
          error: 'You are not authorized to access this battle',
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: battle });
  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json(
      { success: false, error: 'Server error or invalid ID' },
      { status: 500 }
    );
  }
}
