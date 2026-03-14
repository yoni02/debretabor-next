import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server';

async function requireSession() {
  const supabase = createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

const ALLOWED_UPDATE_FIELDS = ['title', 'date', 'time', 'type', 'description', 'end_time'];

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const updates: Record<string, unknown> = {};
  for (const k of ALLOWED_UPDATE_FIELDS) {
    if (body[k] !== undefined) updates[k] = body[k];
  }
  const { data, error } = await createSupabaseAdmin()
    .from('events').update(updates).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...data, _id: data.id });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { error } = await createSupabaseAdmin().from('events').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
