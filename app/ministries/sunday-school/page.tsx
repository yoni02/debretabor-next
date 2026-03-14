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
        <h2>Schedule</h2>
        <div className="schedule-list">
          <div className="schedule-item">
            <div className="schedule-icon"><i className="fas fa-book-open"></i></div>
            <div>
              <div className="schedule-day">Teaching / Lesson</div>
              <div className="schedule-time">Every Sunday — 9:30 AM to 10:00 AM · A sermon from our deacon or priest, right after liturgy, in the church building</div>
            </div>
          </div>
          <div className="schedule-item">
            <div className="schedule-icon"><i className="fas fa-child"></i></div>
            <div>
              <div className="schedule-day">Children (ages 4–18)</div>
              <div className="schedule-time">Every Sunday — 9:30 AM to 10:30 AM · English</div>
            </div>
          </div>
          <div className="schedule-item">
            <div className="schedule-icon"><i className="fas fa-user-graduate"></i></div>
            <div>
              <div className="schedule-day">Youth &amp; Adults (18+)</div>
              <div className="schedule-time">Every Sunday — 11:00 AM to 1:00 PM · English and Amharic options</div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-section">
        <h2>About Sunday School</h2>
        <p>Classes for youth and adults to learn about the Orthodox Christian faith, rooted in Scripture, Tradition, and the lives of the saints. Our teachers guide students through the depth of Ethiopian Orthodox theology in an accessible and welcoming environment.</p>
      </div>
      <div className="content-section">
        <h2>Children&apos;s Classes</h2>
        <p>Age-appropriate lessons in the Orthodox faith, the sacraments, icons, and Ethiopian Orthodox Christian heritage. Children learn through stories, song, and hands-on activities that make the faith come alive. Classes are taught in English.</p>
      </div>
      <div className="content-section">
        <h2>Youth &amp; Adult Education</h2>
        <p>Regular study sessions on Orthodox theology, scripture, and church history for youth and adults at all stages of their faith journey. Whether you are a lifelong believer or newly exploring the faith, all are welcome. Sessions are offered in both English and Amharic.</p>
      </div>
    </>
  );
}
