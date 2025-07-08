import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { getAccessTokenFromHeaders } from '@/lib/helpers';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export async function GET(req) {
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

  const userId = user?.userId;
  const userExists = await User.findById(userId);
  if (!userExists) {
    return NextResponse.json(
      { error: 'Unauthorized: User no longer exists.' },
      { status: 401 }
    );
  }
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

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profileImageUrl: user.profileImageUrl,
          totalMatches: user.totalMatches,
          gamesWon: user.gamesWon,
          cleanSweaps: user.cleanSweaps,
          perfects: user.perfects,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, data: null, error: 'Server error' },
      { status: 500 }
    );
  }
}
