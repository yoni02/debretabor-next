import Link from 'next/link';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8' }}>
      <nav style={{ background: '#130804', padding: '0.8rem 2rem', display: 'flex', alignItems: 'center', gap: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Image src="/church-profile.png" alt="Church" width={40} height={40} style={{ borderRadius: '50%', border: '2px solid #C8941A' }} />
          <span style={{ color: '#C8941A', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.04em' }}>Admin Panel</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
          <Link href="/admin" style={{ color: '#F5EDD8', fontSize: '0.85rem', padding: '0.4rem 0.8rem', borderRadius: 8, textDecoration: 'none' }}>Dashboard</Link>
          <Link href="/admin/events" style={{ color: '#F5EDD8', fontSize: '0.85rem', padding: '0.4rem 0.8rem', borderRadius: 8, textDecoration: 'none' }}>Events</Link>
          <Link href="/admin/gallery" style={{ color: '#F5EDD8', fontSize: '0.85rem', padding: '0.4rem 0.8rem', borderRadius: 8, textDecoration: 'none' }}>Gallery</Link>
          <Link href="/" style={{ color: '#C8941A', fontSize: '0.85rem', padding: '0.4rem 0.8rem', borderRadius: 8, textDecoration: 'none', border: '1px solid #C8941A' }}>← View Site</Link>
        </div>
      </nav>
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {children}
      </main>
    </div>
  );
}
