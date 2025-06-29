import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongoose';
import BattleRequest from '@/models/BattleRequest';
import Pusher from 'pusher';
import { cookies } from 'next/headers';

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
  if (!requestId || !['accept', 'reject'].includes(action)) {
    return NextResponse.json(
      { success: false, error: 'Invalid input' },
      { status: 400 }
    );
  }

  const battleRequest = await BattleRequest.findById(requestId);

  if (!battleRequest || battleRequest.status !== 'requested') {
    return NextResponse.json(
      { success: false, error: 'Request not found or already responded to' },
      { status: 404 }
    );
  }
  const requesterId = battleRequest?.requester?.id?.toString();
  const acceptorId = battleRequest?.acceptor?.id?.toString();
  if (acceptorId !== user.userId) {
    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403 }
    );
  }

  if (['accept', 'finish'].includes(action)) {
    let requestStatus = 'in-match';
    if (action === 'finish') {
      requestStatus = 'finished';
    }
    await BattleRequest.updateOne(
      { _id: requestId },
      { $set: { status: requestStatus }, $unset: { expiresAt: 1 } }
    );
  } else {
    battleRequest.status = 'rejected';
    await battleRequest.save();
  }

  // Notify requester via Pusher
  await pusher.trigger(
    `private-user-${requesterId}`,
    'battle-request-updated',
    {
      _id: battleRequest._id,
      status: battleRequest.status,
      updatedAt: battleRequest.updatedAt,
    }
  );

  return NextResponse.json({ success: true, data: battleRequest });
}
