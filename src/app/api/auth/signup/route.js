import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { writeFile } from 'fs/promises';
import path from 'path';
import { passwordRegex } from '@/constants';
import { NextResponse } from 'next/server';

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

    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          message:
            'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
        },
        { status: 400 }
      );
    }
    if (!firstName || !lastName || !email || !password || !file) {
      return NextResponse.json(
        { message: 'All fields required' },
        {
          status: 400,
        }
      );
    }

    await dbConnect();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: 'Email already exists' },
        {
          status: 409,
        }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length > 1 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'File too large (max 1MB)' },
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
    });

    return NextResponse.json(
      { message: 'User created', user },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      {
        status: 500,
      }
    );
  }
}
