import type { Metadata } from 'next';
import AnimationsInit from '@/components/AnimationsInit';
import GalleryGrid from '@/components/GalleryGrid';
import { createSupabaseAdmin } from '@/lib/supabase-server';

export const metadata: Metadata = { title: 'Photo Gallery' };

// Always fetch fresh from Supabase so admin changes appear immediately
export const dynamic = 'force-dynamic';

// Shown only if the DB has no photos (before admin initializes)
const FALLBACK_PHOTOS = [
  { src: '/screenshot-s12.png', caption: 'The Holy Trinity',               alt: 'Ethiopian Orthodox icon of the Holy Trinity' },
  { src: '/screenshot-s11.png', caption: 'Virgin Mary & Christ Child',     alt: 'Ethiopian Orthodox icon of the Theotokos with Christ Child' },
  { src: '/screenshot-s10.png', caption: 'Ancient of Days God the Father', alt: 'Depiction of Ancient of Days from Daniel 7:9-10' },
  { src: '/screenshot-s7.png',  caption: 'Congregation Gathering',         alt: 'Congregation gathered outside the church' },
  { src: '/screenshot-s2.png',  caption: 'Our Church',                     alt: 'Debre Tabor Church building at dusk' },
  { src: '/screenshot-s5.png',  caption: 'Sacred Procession',              alt: 'Liturgical procession with priests carrying an icon' },
  { src: '/screenshot-s6.png',  caption: 'Blessing Ceremony',              alt: 'Clergy performing an outdoor blessing ceremony' },
  { src: '/screenshot-s3.png',  caption: 'Choir & Deacons',               alt: 'Deacons singing in white robes with ceremonial staffs' },
  { src: '/Choir1.JPG',         caption: 'Choir in Worship',               alt: 'Church choir members gathered in worship' },
  { src: '/Choir2.JPG',         caption: 'Choir During Liturgy',           alt: 'Choir singing during the Divine Liturgy' },
  { src: '/fellowship.png',     caption: 'Fellowship After Liturgy',       alt: 'Community gathering for fellowship after Sunday Liturgy' },
  { src: '/sundayschool.png',   caption: 'Sunday School',                  alt: 'Sunday School students learning about the Orthodox faith' },
];

async function getPhotos() {
  try {
    const { data, error } = await createSupabaseAdmin()
      .from('gallery_photos')
      .select('public_url, caption, sort_order, created_at')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) return FALLBACK_PHOTOS;

    // Match admin: sort_order asc (nulls last), then created_at asc as tiebreaker
    const sorted = [...data].sort((a, b) => {
      const ao = a.sort_order ?? 9999;
      const bo = b.sort_order ?? 9999;
      return ao !== bo ? ao - bo : (a.created_at ?? '').localeCompare(b.created_at ?? '');
    });

    return sorted.map(p => ({
      src: p.public_url as string,
      caption: (p.caption as string) ?? '',
      alt: (p.caption as string) || 'Church photo',
    }));
  } catch {
    return FALLBACK_PHOTOS;
  }
}

export default async function GalleryPage() {
  const photos = await getPhotos();

  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>Photo Gallery</h1>
        <p>Moments from our church community</p>
      </div>
      <GalleryGrid photos={photos} />
    </>
  );
}
