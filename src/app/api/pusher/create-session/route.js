import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Pusher from 'pusher';
import jwt from 'jsonwebtoken';
import BattleRequest from '@/models/BattleRequest';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export async function POST(req) {
  await dbConnect();

  const token = await cookies().get('accessToken')?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, data: null, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  let requester;
  try {
    requester = jwt.verify(token, JWT_ACCESS_SECRET);
  } catch (err) {
    return NextResponse.json(
      { success: false, data: null, error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  const body = await req.json();

  const {
    userId: requesterId,
    firstName,
    lastName,
    profileImageUrl,
  } = requester;
  const name = `${firstName} ${lastName}`;
  const { acceptorId } = body;

  if (!acceptorId) {
    return NextResponse.json(
      { success: false, data: null, error: 'Acceptor ID is required' },
      { status: 400 }
    );
  }
  const acceptor = await User.findOne({
    _id: acceptorId,
  }).select('firstName lastName profileImageUrl');

  const existingRequest = await BattleRequest.findOne({
    status: 'requested',
    $or: [
      { 'requester.id': requesterId, 'acceptor.id': acceptorId },
      { 'requester.id': acceptorId, 'acceptor.id': requesterId },
    ],
  });

  if (existingRequest) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: `Battle request already pending with ${acceptor?.firstName}.`,
      },
      { status: 400 }
    );
  }

  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

  const battleRequest = await BattleRequest.create({
    requester: {
      id: requesterId,
      name,
      profileImage: profileImageUrl,
    },
    acceptor: {
      id: acceptorId,
      name: `${acceptor?.firstName} ${acceptor?.lastName}`,
      profileImage: acceptor?.profileImageUrl,
    },
    status: 'requested',
    expiresAt,
  });

  await pusher.trigger(
    `private-user-${acceptorId}`, // target only the acceptor
    'battle-request-received',
    {
      _id: battleRequest._id,
      requester: battleRequest.requester,
      acceptor: battleRequest.acceptor,
      status: battleRequest.status,
      createdAt: battleRequest.createdAt,
    }
  );

  return NextResponse.json(
    { success: true, data: battleRequest, error: '' },
    { status: 200 }
  );
}
