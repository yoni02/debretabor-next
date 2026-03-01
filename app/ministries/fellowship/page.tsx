import type { Metadata } from 'next';
import Link from 'next/link';
import AnimationsInit from '@/components/AnimationsInit';

export const metadata: Metadata = { title: 'Fellowship' };

export default function FellowshipPage() {
  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>Fellowship</h1>
        <p>Community, Culture &amp; Shared Faith</p>
      </div>
      <div className="content-section">
        <h2>Who We Are</h2>
        <p>The Fellowship ministry is the heartbeat of our community life. We gather members of all ages to strengthen bonds of friendship, share in the richness of Ethiopian Orthodox culture, and support one another through every season of life.</p>
      </div>
      <div className="content-section">
        <h2>What We Do</h2>
        <p>Our fellowship activities bring the church family together beyond Sunday liturgy — communal meals following holy days, cultural and language programs, support networks for families and newcomers, and social gatherings that welcome all.</p>
      </div>
      <div className="content-section">
        <h2>Cultural Celebrations</h2>
        <p>We celebrate the rich tapestry of Ethiopian Orthodox feast days and national traditions together — from Timkat and Enkutatash to Fasika. These gatherings honor our roots, teach the next generation, and welcome friends to experience the warmth of our community.</p>
      </div>
      <div className="content-section">
        <h2>Get Involved</h2>
        <p>Whether you are a lifelong member or joining us for the first time, there is a place for you. <Link href="/contact" style={{ color: 'var(--eth-gold-rim, #c8a84b)', textDecoration: 'underline' }}>Contact us</Link> to learn about upcoming gatherings.</p>
      </div>
    </>
  );
}
