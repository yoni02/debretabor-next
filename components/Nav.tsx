'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const CHURCH_NAME = 'Debre Tabor Holy God Father';
const CHURCH_SUBTITLE = 'Ethiopian Orthodox Tewahedo Church';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export default function Nav() {
  const pathname = usePathname();

  return (
    <header>
      <nav className="nav">
        <Link href="/" className="nav-left">
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

        <div className="nav-links">
          {/* Home dropdown */}
          <div className="dropdown">
            <Link
              href="/"
              className={`nav-link has-dropdown${isActive(pathname, '/') && pathname === '/' ? ' nav-link--active' : ''}`}
            >
              Home
            </Link>
            <div className="dropdown-menu">
              <Link href="/" className={`dropdown-item${pathname === '/' ? ' dropdown-item--active' : ''}`}>Home</Link>
              <Link href="/about" className={`dropdown-item${isActive(pathname, '/about') ? ' dropdown-item--active' : ''}`}>About</Link>
              <Link href="/gallery" className={`dropdown-item${isActive(pathname, '/gallery') ? ' dropdown-item--active' : ''}`}>Gallery</Link>
              <Link href="/faq" className={`dropdown-item${isActive(pathname, '/faq') ? ' dropdown-item--active' : ''}`}>FAQ</Link>
            </div>
          </div>

          {/* Ministries dropdown */}
          <div className="dropdown">
            <Link
              href="/ministries"
              className={`nav-link has-dropdown${isActive(pathname, '/ministries') ? ' nav-link--active' : ''}`}
            >
              Ministries
            </Link>
            <div className="dropdown-menu">
              <Link href="/ministries" className={`dropdown-item${pathname === '/ministries' ? ' dropdown-item--active' : ''}`}>All Ministries</Link>
              <Link href="/ministries/sunday-school" className={`dropdown-item${isActive(pathname, '/ministries/sunday-school') ? ' dropdown-item--active' : ''}`}>Sunday School</Link>
              <Link href="/ministries/choir" className={`dropdown-item${isActive(pathname, '/ministries/choir') ? ' dropdown-item--active' : ''}`}>Choir</Link>
              <Link href="/ministries/fellowship" className={`dropdown-item${isActive(pathname, '/ministries/fellowship') ? ' dropdown-item--active' : ''}`}>Fellowship</Link>
            </div>
          </div>

          {/* Engage dropdown */}
          <div className="dropdown">
            <Link
              href="/engage/events"
              className={`nav-link has-dropdown${isActive(pathname, '/engage') ? ' nav-link--active' : ''}`}
            >
              Engage
            </Link>
            <div className="dropdown-menu">
              <Link href="/engage/events" className={`dropdown-item${isActive(pathname, '/engage/events') ? ' dropdown-item--active' : ''}`}>Events</Link>
              <Link href="/engage/calendar" className={`dropdown-item${isActive(pathname, '/engage/calendar') ? ' dropdown-item--active' : ''}`}>Calendar</Link>
            </div>
          </div>

          <Link href="/services" className={`nav-link${isActive(pathname, '/services') ? ' nav-link--active' : ''}`}>Services</Link>
          <Link href="/contact" className={`nav-link${isActive(pathname, '/contact') ? ' nav-link--active' : ''}`}>Contact</Link>
          <Link href="/donations" className={`nav-link${isActive(pathname, '/donations') ? ' nav-link--active' : ''}`}>Donations</Link>
        </div>
      </nav>
    </header>
  );
}
