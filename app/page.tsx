import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import AnimationsInit from '@/components/AnimationsInit';

export const metadata: Metadata = {
  title: 'Home — Debre Tabor Holy God Father Ethiopian Orthodox Tewahedo Church',
};

export default function HomePage() {
  return (
    <>
      <AnimationsInit isHome />

      {/* Transfiguration background */}
      <div className="transfiguration-bg" aria-hidden="true">
        <div className="transfiguration-bg-img"></div>
        <div className="transfiguration-bg-overlay"></div>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Debre Tabor<br /><span>Holy God Father</span>
            <em>Ethiopian Orthodox Church</em>
          </h1>
          <p className="hero-subtitle">A house of prayer, worship, and community in Christ</p>
          <div className="hero-actions">
            <Link href="/services" className="btn btn-primary">Join Us This Sunday</Link>
            <Link href="/gallery" className="btn btn-ghost-light">Explore Our Church</Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <div className="quick-cards">
        <Link href="/services" className="quick-card">
          <i className="fas fa-church"></i>
          <span>Services</span>
        </Link>
        <Link href="/gallery" className="quick-card">
          <i className="fas fa-images"></i>
          <span>Gallery</span>
        </Link>
        <Link href="/ministries" className="quick-card">
          <i className="fas fa-hands-praying"></i>
          <span>Ministries</span>
        </Link>
        <Link href="/donations" className="quick-card">
          <i className="fas fa-heart"></i>
          <span>Donate</span>
        </Link>
      </div>

      <div className="section-divider" aria-hidden="true">✦</div>

      {/* Mission Statement */}
      <section className="mission-statement">
        <h2 className="mission-title">Our Mission</h2>
        <p className="mission-text">
          We gather to glorify the Holy Trinity, proclaim the Gospel, and serve our community with love and humility.
        </p>
        <blockquote className="mission-verse">
          <p>&ldquo;And he was transfigured before them, and his face shone like the sun, and his clothes became white as light.&rdquo;</p>
          <cite>— Matthew 17:2</cite>
        </blockquote>
      </section>

      {/* Community Photo Strip */}
      <section className="photo-strip">
        <div className="photo-strip-grid">
          <div className="photo-strip-item">
            <Image src="/screenshot-s3.png" alt="Deacons singing in white robes" width={400} height={300} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
          </div>
          <div className="photo-strip-item photo-strip-tall">
            <Image src="/screenshot-s7.png" alt="Congregation gathered outside the church" width={600} height={400} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
          </div>
          <div className="photo-strip-item">
            <Image src="/screenshot-s5.png" alt="Liturgical procession with priests" width={400} height={300} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
          </div>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true">✦</div>

      {/* Sacred Icons */}
      <section className="icons-section">
        <h2 className="icons-title">The Holy Transfiguration</h2>
        <p className="icons-subtitle">
          The mystery for which our church is named — Debre Tabor, the Mountain of Light
        </p>
        <div className="icons-grid">
          <figure className="icon-frame">
            <Image src="/screenshot-s8.png" alt="Ethiopian Orthodox icon of the Transfiguration of Christ" width={380} height={380} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
          </figure>
          <figure className="icon-frame">
            <Image src="/screenshot-s9.png" alt="Ethiopian Orthodox icon of the Transfiguration, gold background" width={380} height={380} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
          </figure>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true">✦</div>

      {/* Find Us */}
      <section className="find-us-section">
        <h2 className="find-us-title">Find Us</h2>
        <p className="find-us-subtitle">
          231 Taft St, Durham, NC 27703 &mdash;{' '}
          <a
            href="https://www.google.com/maps/search/?api=1&query=Debre+Tabor+Holy+God+Father+Ethiopian+Orthodox+Tewahedo+Church+231+Taft+St+Durham+NC+27703"
            target="_blank"
            rel="noopener noreferrer"
            className="find-us-link"
          >
            Open in Google Maps <i className="fas fa-external-link-alt"></i>
          </a>
        </p>
        <div className="map-embed-wrapper">
          <iframe
            title="Debre Tabor Holy God Father EOTC — 231 Taft St, Durham, NC 27703"
            src="https://maps.google.com/maps?q=Debre+Tabor+Holy+God+Father+Ethiopian+Orthodox+Tewahedo+Church,+231+Taft+St,+Durham,+NC+27703&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <div className="section-divider" aria-hidden="true">✦</div>

      {/* Sunday Timeline */}
      <section className="timeline-section">
        <h2 className="timeline-title">Sunday Schedule</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-icon"><i className="fas fa-music"></i></div>
            <div className="timeline-content">
              <h3>Morning Chants</h3>
              <p>5:30 AM</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-icon"><i className="fas fa-church"></i></div>
            <div className="timeline-content">
              <h3>Divine Liturgy</h3>
              <p>6:00 AM</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-icon"><i className="fas fa-coffee"></i></div>
            <div className="timeline-content">
              <h3>Refreshments</h3>
              <p>After Liturgy</p>
            </div>
          </div>
          <Link href="/ministries" className="timeline-item timeline-link">
            <div className="timeline-icon"><i className="fas fa-users"></i></div>
            <div className="timeline-content">
              <h3>Sunday School / Choir</h3>
              <p>Learn More <i className="fas fa-arrow-right"></i></p>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
