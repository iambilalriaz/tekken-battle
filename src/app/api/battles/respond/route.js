import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongoose';
import Battle from '@/models/Battle';
import Pusher from 'pusher';
import { cookies } from 'next/headers';
import { BATTLE_STATUSES } from '../../../../constants';

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

  const token = cookies()?.get('accessToken')?.value;

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

  if (['accept', 'finish'].includes(action)) {
    let requestStatus = BATTLE_STATUSES.IN_MATCH;
    if (action === 'finish') {
      requestStatus = BATTLE_STATUSES.FINISHED;
    }
    battle.status = requestStatus;

    await Battle.updateOne(
      { _id: requestId },
      { $set: { status: requestStatus }, $unset: { expiresAt: 1 } }
    );
  } else {
    battle.status = BATTLE_STATUSES.REJECTED;
    await battle.save();
  }

  // Notify requester via Pusher
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
