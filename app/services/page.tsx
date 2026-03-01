import type { Metadata } from 'next';
import Link from 'next/link';
import AnimationsInit from '@/components/AnimationsInit';

export const metadata: Metadata = { title: 'Service Schedule' };

export default function ServicesPage() {
  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>Service Schedule</h1>
        <p>When we gather to worship</p>
      </div>

      <section className="timeline-section">
        <h2 className="timeline-title">Sunday Schedule</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-icon"><i className="fas fa-music"></i></div>
            <div className="timeline-content"><h3>Morning Chants</h3><p>5:30 AM</p></div>
          </div>
          <div className="timeline-item">
            <div className="timeline-icon"><i className="fas fa-church"></i></div>
            <div className="timeline-content"><h3>Divine Liturgy</h3><p>6:00 AM</p></div>
          </div>
          <div className="timeline-item">
            <div className="timeline-icon"><i className="fas fa-coffee"></i></div>
            <div className="timeline-content"><h3>Refreshments</h3><p>After Liturgy</p></div>
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

      <section className="other-services">
        <h2 className="section-title">Other Services</h2>
        <div className="schedule-list">
          <div className="schedule-item">
            <div className="schedule-icon"><i className="fas fa-book-open"></i></div>
            <div>
              <div className="schedule-day">Every Other Friday</div>
              <div className="schedule-time">Bible Study</div>
            </div>
          </div>
          <div className="schedule-item">
            <div className="schedule-icon"><i className="fas fa-calendar-star"></i></div>
            <div>
              <div className="schedule-day">Feast Days</div>
              <div className="schedule-time">As announced — Major feasts &amp; vigils</div>
            </div>
          </div>
        </div>
      </section>

      <div className="content-section">
        <h2>First Time Visiting?</h2>
        <p>We&apos;re honored to welcome you. Feel free to arrive a bit early, ask questions, and speak with our priest or parish team before or after the service.</p>
        <p>Dress modestly and reverently. If you are not Orthodox, you are warmly invited to be present and pray with us as we worship.</p>
      </div>
    </>
  );
}
