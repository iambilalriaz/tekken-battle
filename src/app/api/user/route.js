import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export async function GET() {
  await dbConnect();

  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;

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

  const userId = user?.userId;

  try {
    const user = await User.findById(userId).select(
      'firstName lastName email profileImageUrl totalMatches gamesWon cleanSweaps perfects'
    );

    if (!user) {
      return NextResponse.json(
        { success: false, data: null, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, data: null, error: 'Server error' },
      { status: 500 }
    );
  }
}
