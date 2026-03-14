import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server';

async function requireSession() {
  const supabase = createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function GET() {
  const admin = createSupabaseAdmin();
  const { data: folders, error } = await admin
    .from('gallery_folders')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get photo count and first photo URL per folder (first = lowest sort_order)
  const { data: photos } = await admin
    .from('gallery_photos')
    .select('folder_id, public_url, sort_order, created_at')
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });

  const folderStats: Record<string, { count: number; firstUrl: string | null }> = {};
  for (const p of photos ?? []) {
    const fid = p.folder_id ?? '_uncategorized';
    if (!folderStats[fid]) folderStats[fid] = { count: 0, firstUrl: null };
    folderStats[fid].count++;
    if (!folderStats[fid].firstUrl && p.public_url) folderStats[fid].firstUrl = p.public_url;
  }

  const enriched = (folders ?? []).map((f: { id: string; title: string; thumbnail_url: string | null; sort_order: number }) => ({
    ...f,
    photo_count: folderStats[f.id]?.count ?? 0,
    thumbnail_url: f.thumbnail_url || folderStats[f.id]?.firstUrl || null,
  }));

  return NextResponse.json(enriched);
}

export async function POST(req: NextRequest) {
  if (!await requireSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, thumbnail_url, sort_order } = body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from('gallery_folders')
    .insert({
      title: title.trim(),
      thumbnail_url: thumbnail_url || null,
      sort_order: sort_order ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
