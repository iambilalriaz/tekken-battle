import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_ACCESS_SECRET; // Ensure this is defined in your .env

export async function GET() {
  await dbConnect();

  const token = await cookies()?.get('accessToken')?.value;
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

  const userId = user.userId;
  try {
    const users = await User.find({ _id: { $ne: userId } })
      .select('firstName lastName email profileImageUrl')
      .sort({ createdAt: -1 });

    const formattedUsers = users.map((user) => ({
      userId: user._id.toString(), // manual rename
      name: `${user.firstName} ${user.lastName}`, // manual combine
      email: user.email,
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
