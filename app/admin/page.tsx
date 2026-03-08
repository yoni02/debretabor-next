'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createSupabaseBrowser } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [photoCount, setPhotoCount] = useState<number | null>(null);
  const [eventCount, setEventCount] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/admin/login'); return; }
      setEmail(session.user.email ?? '');
    });
    fetch('/api/gallery').then(r => r.json()).then(d => setPhotoCount(Array.isArray(d) ? d.length : 0));
    fetch('/api/events').then(r => r.json()).then(d => setEventCount(Array.isArray(d) ? d.length : 0));
  }, [router]);

  const card = (href: string, icon: string, label: string, sub: string, count: number | null, color: string) => (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#fff', border: '1px solid rgba(184,168,138,0.3)', borderRadius: 20,
        padding: '2rem', boxShadow: '0 2px 12px rgba(61,53,41,0.07)',
        transition: 'all 0.18s', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: '0.75rem',
      }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)', e.currentTarget.style.boxShadow = '0 10px 28px rgba(61,53,41,0.12)')}
        onMouseLeave={e => (e.currentTarget.style.transform = '', e.currentTarget.style.boxShadow = '0 2px 12px rgba(61,53,41,0.07)')}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '2.2rem' }}>{icon}</span>
          {count !== null && (
            <span style={{ background: color, color: '#fff', borderRadius: 999, padding: '0.2rem 0.75rem', fontSize: '0.8rem', fontWeight: 700 }}>
              {count} items
            </span>
          )}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#3d3529' }}>{label}</div>
          <div style={{ color: '#6b5d4d', fontSize: '0.85rem', marginTop: '0.25rem' }}>{sub}</div>
        </div>
        <div style={{ color: color, fontSize: '0.82rem', fontWeight: 600 }}>Open → </div>
      </div>
    </Link>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#b8860b', margin: 0 }}>Dashboard</h1>
        {email && <p style={{ color: '#6b5d4d', marginTop: '0.35rem', fontSize: '0.9rem' }}>Signed in as <strong>{email}</strong></p>}
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {card('/admin/gallery', '🖼️', 'Gallery Manager', 'Upload, reorder & caption photos shown on the site', photoCount, '#b8860b')}
        {card('/admin/events', '📅', 'Events & Calendar', 'Add, edit & delete liturgies, feasts, fellowship events', eventCount, '#7A1818')}
      </div>

      {/* Quick tips */}
      <div style={{ background: '#fff', border: '1px solid rgba(184,168,138,0.3)', borderRadius: 20, padding: '1.75rem', boxShadow: '0 2px 12px rgba(61,53,41,0.06)' }}>
        <h2 style={{ color: '#b8860b', fontSize: '1.05rem', marginBottom: '1rem' }}>Quick Reference</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {[
            ['🖼️', 'Gallery', 'Upload photos, edit captions, and drag to reorder. Changes appear on the Gallery page.'],
            ['📅', 'Events', 'Add any type of event — liturgies, feasts, bible study, or fellowship. They show on the calendar.'],
            ['↕️', 'Photo Order', 'Drag photos in the gallery grid to set display order, then click "Save Order".'],
            ['✏️', 'Captions', 'Click a caption to edit it inline, then press Enter or click Save.'],
          ].map(([icon, title, desc]) => (
            <div key={title as string} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.1rem', marginTop: '0.05rem' }}>{icon}</span>
              <div>
                <span style={{ fontWeight: 600, color: '#3d3529', fontSize: '0.9rem' }}>{title} — </span>
                <span style={{ color: '#6b5d4d', fontSize: '0.88rem' }}>{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
