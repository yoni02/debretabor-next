'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const CHURCH_NAME = 'Debre Tabor Holy God Father';
const CHURCH_SUBTITLE = 'Ethiopian Orthodox Tewahedo Church';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  function toggleDropdown(name: string) {
    setOpenDropdown(prev => prev === name ? null : name);
  }

  return (
    <header>
      <nav className="nav">
        <Link href="/" className="nav-left" onClick={() => setMenuOpen(false)}>
          <div className="nav-logo">
            <Image
              src="/church-profile.png"
              alt={`${CHURCH_NAME} ${CHURCH_SUBTITLE}`}
              width={48}
              height={48}
              className="nav-logo-img"
            />
          </div>
          <div className="nav-meta">
            <div className="nav-title">{CHURCH_NAME}</div>
            <div className="nav-subtitle">{CHURCH_SUBTITLE}</div>
          </div>
        </Link>

        {/* Hamburger button — mobile only */}
        <button
          className={`nav-hamburger${menuOpen ? ' is-open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>

        {/* Desktop links */}
        <div className="nav-links">
          <div className="dropdown">
            <Link href="/" className={`nav-link has-dropdown${isActive(pathname, '/') && pathname === '/' ? ' nav-link--active' : ''}`}>Home</Link>
            <div className="dropdown-menu">
              <Link href="/"       className={`dropdown-item${pathname === '/' ? ' dropdown-item--active' : ''}`}>Home</Link>
              <Link href="/about"  className={`dropdown-item${isActive(pathname, '/about')   ? ' dropdown-item--active' : ''}`}>About</Link>
              <Link href="/gallery" className={`dropdown-item${isActive(pathname, '/gallery') ? ' dropdown-item--active' : ''}`}>Gallery</Link>
              <Link href="/faq"    className={`dropdown-item${isActive(pathname, '/faq')     ? ' dropdown-item--active' : ''}`}>FAQ</Link>
            </div>
          </div>

          <div className="dropdown">
            <Link href="/ministries" className={`nav-link has-dropdown${isActive(pathname, '/ministries') ? ' nav-link--active' : ''}`}>Ministries</Link>
            <div className="dropdown-menu">
              <Link href="/ministries"                  className={`dropdown-item${pathname === '/ministries'                       ? ' dropdown-item--active' : ''}`}>All Ministries</Link>
              <Link href="/ministries/sunday-school"    className={`dropdown-item${isActive(pathname, '/ministries/sunday-school')  ? ' dropdown-item--active' : ''}`}>Sunday School</Link>
              <Link href="/ministries/choir"            className={`dropdown-item${isActive(pathname, '/ministries/choir')          ? ' dropdown-item--active' : ''}`}>Choir</Link>
              <Link href="/ministries/fellowship"       className={`dropdown-item${isActive(pathname, '/ministries/fellowship')     ? ' dropdown-item--active' : ''}`}>Fellowship</Link>
            </div>
          </div>

          <div className="dropdown">
            <Link href="/engage/events" className={`nav-link has-dropdown${isActive(pathname, '/engage') ? ' nav-link--active' : ''}`}>Engage</Link>
            <div className="dropdown-menu">
              <Link href="/engage/events"    className={`dropdown-item${isActive(pathname, '/engage/events')    ? ' dropdown-item--active' : ''}`}>Events</Link>
              <Link href="/engage/calendar"  className={`dropdown-item${isActive(pathname, '/engage/calendar')  ? ' dropdown-item--active' : ''}`}>Calendar</Link>
            </div>
          </div>

          <Link href="/services"  className={`nav-link${isActive(pathname, '/services')  ? ' nav-link--active' : ''}`}>Services</Link>
          <Link href="/contact"   className={`nav-link${isActive(pathname, '/contact')   ? ' nav-link--active' : ''}`}>Contact</Link>
          <Link href="/donations" className={`nav-link${isActive(pathname, '/donations') ? ' nav-link--active' : ''}`}>Donations</Link>
        </div>

        {/* Mobile slide-down menu */}
        {menuOpen && (
          <div className="mobile-menu">
            {/* Home group */}
            <div className="mobile-group">
              <button className="mobile-group-toggle" onClick={() => toggleDropdown('home')}>
                Home <span className={`mobile-chevron${openDropdown === 'home' ? ' open' : ''}`}>▾</span>
              </button>
              {openDropdown === 'home' && (
                <div className="mobile-submenu">
                  <Link href="/"        className="mobile-item" onClick={() => setMenuOpen(false)}>Home</Link>
                  <Link href="/about"   className="mobile-item" onClick={() => setMenuOpen(false)}>About</Link>
                  <Link href="/gallery" className="mobile-item" onClick={() => setMenuOpen(false)}>Gallery</Link>
                  <Link href="/faq"     className="mobile-item" onClick={() => setMenuOpen(false)}>FAQ</Link>
                </div>
              )}
            </div>

            <div className="mobile-group">
              <button className="mobile-group-toggle" onClick={() => toggleDropdown('ministries')}>
                Ministries <span className={`mobile-chevron${openDropdown === 'ministries' ? ' open' : ''}`}>▾</span>
              </button>
              {openDropdown === 'ministries' && (
                <div className="mobile-submenu">
                  <Link href="/ministries"               className="mobile-item" onClick={() => setMenuOpen(false)}>All Ministries</Link>
                  <Link href="/ministries/sunday-school" className="mobile-item" onClick={() => setMenuOpen(false)}>Sunday School</Link>
                  <Link href="/ministries/choir"         className="mobile-item" onClick={() => setMenuOpen(false)}>Choir</Link>
                  <Link href="/ministries/fellowship"    className="mobile-item" onClick={() => setMenuOpen(false)}>Fellowship</Link>
                </div>
              )}
            </div>

            <div className="mobile-group">
              <button className="mobile-group-toggle" onClick={() => toggleDropdown('engage')}>
                Engage <span className={`mobile-chevron${openDropdown === 'engage' ? ' open' : ''}`}>▾</span>
              </button>
              {openDropdown === 'engage' && (
                <div className="mobile-submenu">
                  <Link href="/engage/events"   className="mobile-item" onClick={() => setMenuOpen(false)}>Events</Link>
                  <Link href="/engage/calendar" className="mobile-item" onClick={() => setMenuOpen(false)}>Calendar</Link>
                </div>
              )}
            </div>

            <Link href="/services"  className="mobile-item mobile-item--top" onClick={() => setMenuOpen(false)}>Services</Link>
            <Link href="/contact"   className="mobile-item mobile-item--top" onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link href="/donations" className="mobile-item mobile-item--top mobile-item--donate" onClick={() => setMenuOpen(false)}>Donations</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
