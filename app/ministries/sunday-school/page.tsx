import type { Metadata } from 'next';
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
      <div className="content-section">
        <h2>About Sunday School</h2>
        <p>Classes for youth and adults to learn about the Orthodox Christian faith, rooted in Scripture, Tradition, and the lives of the saints.</p>
      </div>
      <div className="content-section">
        <h2>Children&apos;s Classes</h2>
        <p>Age-appropriate lessons in the Orthodox faith, the sacraments, icons, and Ethiopian Orthodox Christian heritage.</p>
      </div>
      <div className="content-section">
        <h2>Adult Education</h2>
        <p>Regular study sessions on Orthodox theology, scripture, and church history for adults at all stages of their faith journey.</p>
      </div>
    </>
  );
}
