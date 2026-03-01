import type { Metadata } from 'next';
import AnimationsInit from '@/components/AnimationsInit';

export const metadata: Metadata = { title: 'Choir & Chant' };

export default function ChoirPage() {
  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>Choir &amp; Chant</h1>
        <p>Prayer &amp; Worship</p>
      </div>
      <div className="content-section">
        <h2>About Our Choir</h2>
        <p>Traditional Orthodox hymns and chants that lead the faithful to pray with the Church through every season.</p>
      </div>
      <div className="content-section">
        <h2>Join Us</h2>
        <p>We welcome new members who are interested in serving through music. No prior experience required.</p>
      </div>
      <div className="content-section">
        <h2>Rehearsal Times</h2>
        <p>Contact us to learn about rehearsal schedules and how to get involved.</p>
      </div>
    </>
  );
}
