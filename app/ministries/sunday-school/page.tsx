import type { Metadata } from 'next';
import Image from 'next/image';
import AnimationsInit from '@/components/AnimationsInit';

export const metadata: Metadata = { title: 'Sunday School' };

export default function SundaySchoolPage() {
  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>Sunday School</h1>
        <p>Faith Formation &amp; Education</p>
      </div>

      {/* Full-width photo banner */}
      <div className="ministry-photo-banner">
        <Image
          src="/sundayschool.png"
          alt="Sunday School students learning about the Orthodox faith"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          sizes="100vw"
          priority
        />
        <div className="ministry-photo-banner-overlay" />
        <p className="ministry-photo-banner-caption">Faith formation for all ages</p>
      </div>

      <div className="content-section">
        <h2>About Sunday School</h2>
        <p>Classes for youth and adults to learn about the Orthodox Christian faith, rooted in Scripture, Tradition, and the lives of the saints. Our teachers guide students through the depth of Ethiopian Orthodox theology in an accessible and welcoming environment.</p>
      </div>
      <div className="content-section">
        <h2>Children&apos;s Classes</h2>
        <p>Age-appropriate lessons in the Orthodox faith, the sacraments, icons, and Ethiopian Orthodox Christian heritage. Children learn through stories, song, and hands-on activities that make the faith come alive.</p>
      </div>
      <div className="content-section">
        <h2>Adult Education</h2>
        <p>Regular study sessions on Orthodox theology, scripture, and church history for adults at all stages of their faith journey. Whether you are a lifelong believer or newly exploring the faith, all are welcome.</p>
      </div>
    </>
  );
}
