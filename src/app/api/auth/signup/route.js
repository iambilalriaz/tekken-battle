import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { writeFile } from 'fs/promises';
import path from 'path';
import { passwordRegex } from '@/constants';
import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth/loginUser';
import { cookies } from 'next/headers';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();

    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
    const file = formData.get('profileImage');

    if (!firstName || !lastName || !email || !password || !file) {
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

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length > 1 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, data: null, error: 'File too large (max 1MB)' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), '/public/uploads');
    const filename = `${email}-${file.name}`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImage: `/uploads/${filename}`,

      gamesWon: 0,
      cleanSweaps: 0,
      perfects: 0,
    });

    // ✅ Automatically login the user using loginUser helper
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
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profileImage: user.profileImage,
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
