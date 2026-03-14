import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get('folder_id');

  let query = createSupabaseAdmin()
    .from('gallery_photos')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (folderId) {
    query = query.eq('folder_id', folderId);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const auth = createSupabaseServer();
  const { data: { session } } = await auth.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file    = formData.get('file') as File;
  const caption = (formData.get('caption') as string) || '';
  const section = (formData.get('section') as string) || 'gallery';
  const folderId = (formData.get('folder_id') as string) || null;

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const bytes  = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext    = file.name.split('.').pop();
  const path   = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const admin = createSupabaseAdmin();

  const { error: uploadError } = await admin.storage
    .from('church-images')
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: urlData } = admin.storage.from('church-images').getPublicUrl(path);

  const { data, error } = await admin
    .from('gallery_photos')
    .insert({
      storage_path: path,
      public_url: urlData.publicUrl,
      caption,
      section,
      folder_id: folderId || null,
    })
    .select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
