'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import AdminSignOut from '@/components/AdminSignOut';

const NAV_LINKS = [
  { href: '/admin',          label: 'Dashboard', icon: 'fa-gauge-high' },
  { href: '/admin/gallery',  label: 'Gallery',   icon: 'fa-images' },
  { href: '/admin/events',   label: 'Events',    icon: 'fa-calendar-days' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isLoginPage = path === '/admin/login';
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [path]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <div className="admin-shell">
      {!isLoginPage && (
        <nav className="admin-nav">
          <div className="admin-nav-brand">
            <Image src="/church-profile.png" alt="Church" width={36} height={36}
              className="admin-nav-logo" />
            <div>
              <div className="admin-nav-title">Admin Panel</div>
              <div className="admin-nav-subtitle">Debre Tabor EOTC</div>
            </div>
          </div>

          <button
            className="admin-nav-hamburger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>

          <div className={`admin-nav-links${menuOpen ? ' is-open' : ''}`}>
            {NAV_LINKS.map(({ href, label, icon }) => {
              const active = href === '/admin' ? path === '/admin' : path.startsWith(href);
              return (
                <Link key={href} href={href} className={`admin-nav-link${active ? ' is-active' : ''}`}
                  onClick={() => setMenuOpen(false)}>
                  <i className={`fas ${icon}`} /> {label}
                </Link>
              );
            })}
            <Link href="/" className="admin-nav-view-site" onClick={() => setMenuOpen(false)}>
              ← View Site
            </Link>
            <div className="admin-nav-signout">
              <AdminSignOut />
            </div>
          </div>
        </nav>
      )}

      <main className="admin-main">{children}</main>
    </div>
  );
}
