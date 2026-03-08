'use client';

import { usePathname } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    // Admin has its own layout — render children directly, no public nav/footer
    return <>{children}</>;
  }

  return (
    <>
      <div className="transfiguration-bg" aria-hidden="true">
        <div className="transfiguration-bg-img"></div>
        <div className="transfiguration-bg-overlay"></div>
      </div>
      <div className="page">
        <div className="shell">
          <Nav />
          <main>{children}</main>
        </div>
        <Footer />
      </div>
    </>
  );
}
