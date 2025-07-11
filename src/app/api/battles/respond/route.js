import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongoose';
import Battle from '@/models/Battle';
import Pusher from 'pusher';
import { BATTLE_STATUSES } from '@/constants';
import { getAccessTokenFromHeaders } from '@/lib/helpers';
import User from '@/models/User';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export async function PATCH(req) {
  await dbConnect();

  const token = getAccessTokenFromHeaders(req);

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  let user;

  try {
    user = jwt.verify(token, JWT_ACCESS_SECRET);
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
  const userExists = await User.findById(user?.userId);
  if (!userExists) {
    return NextResponse.json(
      { error: 'Unauthorized: User no longer exists.' },
      { status: 401 }
    );
  }

  const { requestId, action } = await req.json();
  if (!requestId || !action) {
    return NextResponse.json(
      { success: false, error: 'Invalid input' },
      { status: 400 }
    );
  }

  const battle = await Battle.findById(requestId);

  if (!battle) {
    return NextResponse.json(
      { success: false, error: 'Request not found.' },
      { status: 404 }
    );
  }

  const requesterId = battle?.requester?.id?.toString();
  const acceptorId = battle?.acceptor?.id?.toString();

  if (![requesterId, acceptorId].includes(user.userId)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403 }
    );
  }

  // 🚫 Prevent finishing an already finished battle
  if (action === 'finish' && battle.status === BATTLE_STATUSES.FINISHED) {
    return NextResponse.json(
      { success: false, error: 'Battle is already finished.' },
      { status: 400 }
    );
  }

  if (['accept', 'finish'].includes(action)) {
    const newStatus =
      action === 'accept' ? BATTLE_STATUSES.IN_MATCH : BATTLE_STATUSES.FINISHED;

    await Battle.updateOne(
      { _id: requestId },
      { $set: { status: newStatus }, $unset: { expiresAt: 1 } }
    );

    battle.status = newStatus;
  } else {
    battle.status = BATTLE_STATUSES.REJECTED;
    await battle.save();
  }

  // 🔔 Notify requester via Pusher
  await pusher.trigger(
    `private-user-${requesterId}`,
    'battle-request-updated',
    {
      _id: battle._id,
      status: battle.status,
      updatedAt: battle.updatedAt,
    }
  );

  return NextResponse.json({ success: true, data: battle });
}
