import { NextResponse } from 'next/server';
import { createSupabaseServer, createSupabaseAdmin } from '@/lib/supabase-server';

// Default photos stored in /public — referenced by their site-relative URL
const DEFAULT_PHOTOS = [
  { public_url: '/screenshot-s12.png', caption: 'The Holy Trinity',              section: 'gallery', sort_order: 0 },
  { public_url: '/screenshot-s11.png', caption: 'Virgin Mary & Christ Child',    section: 'gallery', sort_order: 1 },
  { public_url: '/screenshot-s10.png', caption: 'Ancient of Days God the Father',section: 'gallery', sort_order: 2 },
  { public_url: '/screenshot-s7.png',  caption: 'Congregation Gathering',        section: 'gallery', sort_order: 3 },
  { public_url: '/screenshot-s2.png',  caption: 'Our Church',                    section: 'gallery', sort_order: 4 },
  { public_url: '/screenshot-s5.png',  caption: 'Sacred Procession',             section: 'gallery', sort_order: 5 },
  { public_url: '/screenshot-s6.png',  caption: 'Blessing Ceremony',             section: 'gallery', sort_order: 6 },
  { public_url: '/screenshot-s3.png',  caption: 'Choir & Deacons',              section: 'gallery', sort_order: 7 },
  { public_url: '/Choir1.JPG',         caption: 'Choir in Worship',              section: 'gallery', sort_order: 8 },
  { public_url: '/Choir2.JPG',         caption: 'Choir During Liturgy',          section: 'gallery', sort_order: 9 },
  { public_url: '/fellowship.png',     caption: 'Fellowship After Liturgy',      section: 'gallery', sort_order: 10 },
  { public_url: '/sundayschool.png',   caption: 'Sunday School',                 section: 'gallery', sort_order: 11 },
  { public_url: '/screenshot-s8.png',  caption: 'The Transfiguration (Icon)',    section: 'gallery', sort_order: 12 },
  { public_url: '/screenshot-s9.png',  caption: 'The Transfiguration (Gold)',    section: 'gallery', sort_order: 13 },
  { public_url: '/screenshot-s1.png',  caption: 'Church Profile',                section: 'gallery', sort_order: 14 },
  { public_url: '/screenshot-s4.png',  caption: 'Church Seal',                   section: 'gallery', sort_order: 15 },
];

export async function POST() {
  // Require admin session
  const auth = createSupabaseServer();
  const { data: { session } } = await auth.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createSupabaseAdmin();

  // Check how many rows already exist
  const { count } = await admin
    .from('gallery_photos')
    .select('id', { count: 'exact', head: true });

  if ((count ?? 0) > 0) {
    return NextResponse.json({ message: `Already has ${count} photos — skipped seed.` });
  }

  // Try inserting with sort_order first; if that column doesn't exist yet, retry without it
  // storage_path = '' signals a public-folder photo (no Supabase Storage entry to delete)
  let insertResult = await admin
    .from('gallery_photos')
    .insert(DEFAULT_PHOTOS.map(p => ({ ...p, storage_path: '' })))
    .select();

  if (insertResult.error?.message?.includes('sort_order')) {
    // sort_order column not added yet — insert without it
    insertResult = await admin
      .from('gallery_photos')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .insert(DEFAULT_PHOTOS.map(({ sort_order: _so, ...p }) => ({ ...p, storage_path: '' })))
      .select();
  }

  const { data, error } = insertResult;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ inserted: data?.length ?? 0 });
}
