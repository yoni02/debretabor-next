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

    async function fetchPhotos() {
      const { data, error } = await supabase
        .from('gallery_photos')
        .select('public_url, caption, sort_order, created_at')
        .order('created_at', { ascending: true });

      if (error || !data || data.length === 0) {
        setPhotos(FALLBACK);
      } else {
        const sorted = [...data].sort((a, b) => {
          const ao = (a.sort_order as number | null) ?? 9999;
          const bo = (b.sort_order as number | null) ?? 9999;
          return ao !== bo
            ? ao - bo
            : ((a.created_at as string) ?? '').localeCompare((b.created_at as string) ?? '');
        });
        setPhotos(sorted.map(p => ({
          src: p.public_url as string,
          caption: (p.caption as string) ?? '',
          alt: (p.caption as string) || 'Church photo',
        })));
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
