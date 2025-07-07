import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');
  const fileName = formData.get('fileName') || file.name;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const blob = await put(fileName, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
    allowOverwrite: true,
  });

  return NextResponse.json({ url: blob.url });
}
