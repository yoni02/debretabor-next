import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = createSupabaseServer();
  const { data: { session } } = await auth.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createSupabaseAdmin();

  const { data: photo, error: fetchErr } = await admin
    .from('gallery_photos').select('storage_path').eq('id', params.id).single();

  if (fetchErr || !photo) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await admin.storage.from('church-images').remove([photo.storage_path]);

  const { error } = await admin.from('gallery_photos').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
