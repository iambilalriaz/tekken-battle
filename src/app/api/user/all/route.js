import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { getAccessTokenFromHeaders } from '@/lib/helpers';

const JWT_SECRET = process.env.JWT_ACCESS_SECRET; // Ensure this is defined in your .env

export async function GET(req) {
  await dbConnect();

  const token = getAccessTokenFromHeaders(req);
  if (!token) {
    return NextResponse.json(
      { success: false, data: null, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  let user;
  try {
    user = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
  } catch (err) {
    return NextResponse.json(
      { success: false, data: null, error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  const userId = user.userId;

  const userExists = await User.findById(userId);
  if (!userExists) {
    return NextResponse.json(
      { error: 'Unauthorized: User no longer exists.' },
      { status: 401 }
    );
  }

  try {
    const users = await User.find({ _id: { $ne: userId } })
      .select('firstName profileImageUrl')
      .sort({ createdAt: -1 })
      .lean();

    const formattedUsers = users.map((user) => ({
      userId: user._id,
      name: user.firstName,
      profileImage: user.profileImageUrl,
    }));
    return NextResponse.json(
      { success: true, data: formattedUsers, error: null },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
