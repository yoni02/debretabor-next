'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase-browser';
import GalleryGrid from '@/components/GalleryGrid';

type Photo = { src: string; caption: string; alt: string };

const FALLBACK: Photo[] = [
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

export default function GalleryLive() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowser();

    // Fetch through the API route (service-role key) so RLS never blocks reads
    async function fetchPhotos() {
      try {
        const res = await fetch('/api/gallery', { cache: 'no-store' });
        if (!res.ok) throw new Error('fetch failed');
        const data: Array<{ public_url: string; caption: string; sort_order: number | null; created_at: string }> = await res.json();
        if (!data || data.length === 0) { setPhotos(FALLBACK); setLoading(false); return; }
        const sorted = [...data].sort((a, b) => {
          const ao = a.sort_order ?? 9999;
          const bo = b.sort_order ?? 9999;
          return ao !== bo ? ao - bo : (a.created_at ?? '').localeCompare(b.created_at ?? '');
        });
        setPhotos(sorted.map(p => ({
          src: p.public_url,
          caption: p.caption ?? '',
          alt: p.caption || 'Church photo',
        })));
      } catch {
        setPhotos(FALLBACK);
      }
      setLoading(false);
    }

    fetchPhotos();

    // Subscribe — any INSERT / UPDATE / DELETE on gallery_photos instantly refreshes
    const channel = supabase
      .channel('gallery-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_photos' }, () => fetchPhotos())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#6b5d4d', fontSize: '1rem' }}>
        Loading gallery…
      </div>
    );
  }

  return <GalleryGrid photos={photos} />;
}
