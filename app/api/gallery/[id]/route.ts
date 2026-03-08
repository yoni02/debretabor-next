import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server';

async function requireSession() {
  const supabase = createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { data, error } = await createSupabaseAdmin()
    .from('gallery_photos').update(body).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createSupabaseAdmin();

  const { data: photo, error: fetchErr } = await admin
    .from('gallery_photos').select('storage_path').eq('id', params.id).single();

  if (fetchErr || !photo) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Only remove from Supabase Storage if there is a real storage path
  // (public-folder photos use '' or null — nothing to delete from storage)
  if (photo.storage_path && photo.storage_path !== '') {
    await admin.storage.from('church-images').remove([photo.storage_path]);
  }

  const { error } = await admin.from('gallery_photos').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
