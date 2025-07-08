import { NextResponse } from 'next/server';
import Pusher from 'pusher';
import jwt from 'jsonwebtoken';
import { getAccessTokenFromHeaders } from '@/lib/helpers';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export async function POST(req) {
  const rawBody = await req.text();
  const params = new URLSearchParams(rawBody);

  const socketId = params.get('socket_id');
  const channelName = params.get('channel_name');

  const token = getAccessTokenFromHeaders(req);

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = jwt.verify(token, JWT_ACCESS_SECRET);
    const expectedChannel = `private-user-${user.userId}`;

    // Prevent users from subscribing to other users' channels
    if (channelName !== expectedChannel) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const authResponse = pusher.authenticate(socketId, channelName);
    return NextResponse.json(authResponse);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
