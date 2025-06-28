import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    const token = req.cookies.get('accessToken')?.value;
    if (!token) {
      return NextResponse.json({ loggedIn: false }, { status: 200 });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    delete decoded?.iat;

    return NextResponse.json({
      loggedIn: true,
      user: {
        ...decoded,
      },
    });
  } catch (err) {
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }
}
