import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import BattleRequest from '@/models/BattleRequest';

export const dynamic = 'force-dynamic'; // optional: disables caching

export async function GET(req, context) {
  const params = await context.params; // ✅ await params
  const id = params.id;

  await dbConnect();

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Battle request ID is required' },
      { status: 400 }
    );
  }
  console.log('testing id', id);
  try {
    const battle = await BattleRequest.findById(id);

    if (!battle) {
      return NextResponse.json(
        { success: false, error: 'Battle request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: battle });
  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json(
      { success: false, error: 'Server error or invalid ID' },
      { status: 500 }
    );
  }
}
