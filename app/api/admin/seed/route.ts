import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';

/**
 * POST /api/admin/seed
 * Body: { name, email, password, seedKey }
 *
 * Call this once to create the first admin user.
 * Protected by a secret key (SEED_SECRET env var).
 */
export async function POST(req: NextRequest) {
  const { name, email, password, seedKey } = await req.json();

  if (seedKey !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await connectDB();
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email: email.toLowerCase(), hashedPassword, role: 'admin' });

  return NextResponse.json({ id: user._id, email: user.email, name: user.name }, { status: 201 });
}
