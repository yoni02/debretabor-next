import type { Metadata } from 'next';
import Link from 'next/link';
import AnimationsInit from '@/components/AnimationsInit';

export const metadata: Metadata = { title: 'Ministries' };

export default function MinistriesPage() {
  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>Our Ministries</h1>
        <p>Growing together in Christ</p>
      </div>
      <div className="ministries-grid">
        <div className="ministry-card">
          <h3>Sunday School</h3>
          <p>Classes for youth and adults to learn about the Orthodox Christian faith.</p>
          <Link href="/ministries/sunday-school" className="btn btn-primary">Learn More</Link>
        </div>
        <div className="ministry-card">
          <h3>Choir &amp; Chant</h3>
          <p>Traditional Orthodox hymns and chants that lead the faithful in prayer.</p>
          <Link href="/ministries/choir" className="btn btn-primary">Learn More</Link>
        </div>
        <div className="ministry-card">
          <h3>Fellowship</h3>
          <p>Building community bonds through shared meals, cultural celebrations, and support for one another in faith.</p>
          <Link href="/ministries/fellowship" className="btn btn-primary">Learn More</Link>
        </div>
      </div>
    </>
  );
}
