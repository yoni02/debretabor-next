import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Event from '@/lib/models/Event';

export async function GET() {
  await connectDB();
  const events = await Event.find({}).sort({ date: 1 }).lean();
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const body = await req.json();
  const event = await Event.create(body);
  return NextResponse.json(event, { status: 201 });
}
