'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import AdminSignOut from '@/components/AdminSignOut';

const NAV_LINKS = [
  { href: '/admin',          label: 'Dashboard', icon: '⊞' },
  { href: '/admin/gallery',  label: 'Gallery',   icon: '🖼' },
  { href: '/admin/events',   label: 'Events',    icon: '📅' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div style={{ minHeight: '100vh', background: '#f0ebe0', display: 'flex', flexDirection: 'column' }}>

      {/* Top nav bar */}
      <nav style={{
        background: '#130804',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        height: 60,
        boxShadow: '0 2px 16px rgba(0,0,0,0.35)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginRight: '1rem' }}>
          <Image src="/church-profile.png" alt="Church" width={36} height={36}
            style={{ borderRadius: '50%', border: '2px solid #C8941A', objectFit: 'contain' }} />
          <div>
            <div style={{ color: '#C8941A', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.1 }}>Admin Panel</div>
            <div style={{ color: '#6b4c2a', fontSize: '0.7rem' }}>Debre Tabor EOTC</div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
          {NAV_LINKS.map(({ href, label, icon }) => {
            const active = href === '/admin' ? path === '/admin' : path.startsWith(href);
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.45rem 0.9rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600,
                textDecoration: 'none',
                color: active ? '#130804' : '#d4b483',
                background: active ? '#C8941A' : 'transparent',
                transition: 'all 0.15s',
              }}>
                <span>{icon}</span> {label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link href="/" style={{
            color: '#C8941A', fontSize: '0.8rem', padding: '0.4rem 0.9rem',
            borderRadius: 8, border: '1px solid #C8941A', textDecoration: 'none', fontWeight: 600,
          }}>
            ← View Site
          </Link>
          <AdminSignOut />
        </div>
      </nav>

      {/* Page content */}
      <main style={{ flex: 1, maxWidth: 1100, width: '100%', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {children}
      </main>
    </div>
  );
}
