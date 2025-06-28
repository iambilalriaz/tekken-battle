import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Clear the access token cookie
  cookies().set('accessToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0), // Expire immediately
  });

  return NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200 }
  );
}
