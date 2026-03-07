import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Debre Tabor Holy God Father Ethiopian Orthodox Tewahedo Church',
    template: '%s — Debre Tabor Holy God Father EOTC',
  },
  description:
    'Debre Tabor Holy God Father Ethiopian Orthodox Tewahedo Church — A house of prayer, worship, and community in Christ.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        {/* Global watermark background — visible on every page */}
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
      </body>
    </html>
  );
}
