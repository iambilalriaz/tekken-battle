import dbConnect from '@/lib/mongoose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth/loginUser';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    await dbConnect();

    const { user, accessToken } = await loginUser(email, password);

    // Store refresh token in secure HttpOnly cookie
    await cookies().set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          message: 'Login successful',
          accessToken,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
          },
        },
        error: '',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        data: {},
        error: error.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
