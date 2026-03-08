import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server';

export async function GET() {
  const db = createSupabaseAdmin();
  const { data, error } = await db.from('events').select('*').order('date', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // Map Supabase `id` → `_id` so the ChurchEvent interface is satisfied
  return NextResponse.json((data ?? []).map(e => ({ ...e, _id: e.id })));
}

export async function POST(req: NextRequest) {
  const auth = createSupabaseServer();
  const { data: { session } } = await auth.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { data, error } = await createSupabaseAdmin()
    .from('events').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...data, _id: data.id }, { status: 201 });
}
