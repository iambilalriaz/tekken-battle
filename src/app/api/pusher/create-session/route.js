import { NextResponse } from 'next/server';
import Pusher from 'pusher';
import jwt from 'jsonwebtoken';
import Battle from '@/models/Battle';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { BATTLE_STATUSES } from '@/constants';
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
  await dbConnect();

  const token = getAccessTokenFromHeaders(req);
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

  // 🔒 Check if requester or acceptor is already in an IN_MATCH battle
  const activeBattle = await Battle.findOne({
    status: BATTLE_STATUSES.IN_MATCH,
    $or: [
      { 'requester.id': requesterId },
      { 'acceptor.id': requesterId },
      { 'requester.id': acceptorId },
      { 'acceptor.id': acceptorId },
    ],
  });

  if (activeBattle) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: 'One of the players is already in an ongoing battle.',
      },
      { status: 400 }
    );
  }

  // ✅ Check for duplicate REQUESTED status between same pair
  const existingRequest = await Battle.findOne({
    status: BATTLE_STATUSES.REQUESTED,
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

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const battle = await Battle.create({
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
    status: BATTLE_STATUSES.REQUESTED,
    expiresAt,
  });

  await pusher.trigger(
    `private-user-${acceptorId}`,
    'battle-request-received',
    {
      _id: battle._id,
      requester: battle.requester,
      acceptor: battle.acceptor,
      status: battle.status,
      createdAt: battle.createdAt,
    }
  );

  return NextResponse.json(
    { success: true, data: battle, error: '' },
    { status: 200 }
  );
}
