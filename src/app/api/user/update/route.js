import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { getAccessTokenFromHeaders } from '@/lib/helpers';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export async function PATCH(req) {
  await dbConnect();

  const token = getAccessTokenFromHeaders(req);

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: No token provided' },
      { status: 401 }
    );
  }

  let user;
  try {
    user = jwt.verify(token, JWT_ACCESS_SECRET);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired token' },
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
  const body = await req.json();

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: body },
      {
        new: true,
        runValidators: true,
      }
    ).select(
      'firstName lastName email profileImageUrl totalMatches gamesWon cleanSweaps perfects'
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
