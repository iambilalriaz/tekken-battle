import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { passwordRegex } from '@/constants';
import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth/loginUser';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const body = await req.json();

    const { firstName, lastName, email, password, profileImageUrl } = body;

    if (!firstName || !lastName || !email || !password || !profileImageUrl) {
      return NextResponse.json(
        { success: false, data: null, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error:
            'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, data: null, error: 'Email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImageUrl,

      gamesWon: 0,
      cleanSweaps: 0,
      perfects: 0,
    });

    const { accessToken } = await loginUser(email, password);
    cookies().set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          message: 'User created and logged in successfully',
          accessToken,
          user: {
            id: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
          },
        },
        error: '',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: error.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
