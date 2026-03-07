import type { Metadata } from 'next';
import Image from 'next/image';
import AnimationsInit from '@/components/AnimationsInit';

export const metadata: Metadata = { title: 'Choir & Chant' };

export default function ChoirPage() {
  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>Choir &amp; Chant</h1>
        <p>Prayer &amp; Worship Through Sacred Music</p>
      </div>

      {/* Two-photo strip */}
      <div className="ministry-photo-pair" aria-hidden="false">
        <div className="ministry-photo-pair-item">
          <Image
            src="/Choir1.JPG"
            alt="Church choir members gathered in worship"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="ministry-photo-pair-item">
          <Image
            src="/Choir2.JPG"
            alt="Choir singing during the Divine Liturgy"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      <div className="content-section">
        <h2>About Our Choir</h2>
        <p>Traditional Orthodox hymns and chants that lead the faithful to pray with the Church through every season. Rooted in the ancient Ge&apos;ez tradition, our choir carries the sacred music of Ethiopia — melodies passed down through generations of deacons and priests.</p>
      </div>
      <div className="content-section">
        <h2>Join Us</h2>
        <p>We welcome new members who feel called to serve through music. No prior experience is required — only a willing heart and a love for worship. Training in Ge&apos;ez chants and liturgical rhythms is provided.</p>
      </div>
      <div className="content-section">
        <h2>Rehearsal Times</h2>
        <p>Rehearsals are held regularly before and after the Sunday Divine Liturgy. Contact us to learn about the full schedule and how to get involved.</p>
      </div>
    </>
  );
}
