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
            <div className="timeline-icon"><i className="fas fa-hands-praying"></i></div>
            <div className="timeline-content"><h3>Covenant Prayer</h3><p>6:30 AM – 7:30 AM</p></div>
          </div>
          <div className="timeline-item">
            <div className="timeline-icon"><i className="fas fa-church"></i></div>
            <div className="timeline-content"><h3>Divine Liturgy</h3><p>7:00 AM – 9:30 AM</p></div>
          </div>
          <div className="timeline-item">
            <div className="timeline-icon"><i className="fas fa-coffee"></i></div>
            <div className="timeline-content"><h3>Refreshments</h3><p>Right after Divine Liturgy</p></div>
          </div>
          <Link href="/ministries/sunday-school" className="timeline-item timeline-link">
            <div className="timeline-icon"><i className="fas fa-book-open"></i></div>
            <div className="timeline-content">
              <h3>Sunday School</h3>
              <p>Various sessions depending on age group, between 9:30 AM and 1:00 PM</p>
              <span className="timeline-learn-more">Learn more <i className="fas fa-arrow-right"></i></span>
            </div>
          </Link>
        </div>
      </section>

      <section className="other-services">
        <h2 className="section-title">Other Programs</h2>
        <div className="schedule-list">
          <div className="schedule-item">
            <div className="schedule-icon"><i className="fas fa-hands-praying"></i></div>
            <div>
              <div className="schedule-day">Every Saturday</div>
              <div className="schedule-time">Covenant Prayer — 6:30 AM to 7:30 AM</div>
            </div>
          </div>
          <div className="schedule-item">
            <div className="schedule-icon"><i className="fas fa-book-open"></i></div>
            <div>
              <div className="schedule-day">Every other Friday</div>
              <div className="schedule-time">Bible Study (check our calender for more details)</div>
            </div>
          </div>
          <div className="schedule-item">
            <div className="schedule-icon"><i className="fas fa-plate-wheat"></i></div>
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
        <p>If you are not Orthodox, you are warmly invited to be present and pray with us as we worship.</p>
      </div>

      <div className="content-section">
        <h2>What to Wear</h2>
        <p>We ask all who attend to dress modestly and reverently as a sign of respect before God.</p>
        <div className="attire-grid">
          <div className="attire-card">
            <div className="attire-icon"><i className="fas fa-male"></i></div>
            <h3>Men</h3>
            <p>Men are encouraged to wear a <strong>netela</strong> (traditional white shawl) draped around the body during worship.</p>
          </div>
          <div className="attire-card">
            <div className="attire-icon"><i className="fas fa-female"></i></div>
            <h3>Women</h3>
            <p>Women are encouraged to wear a <strong>netela</strong> covering the head, along with a modest dress or skirt.</p>
          </div>
        </div>
        <p className="attire-note">Netelas are available at the church if you do not have one. All are welcome regardless of attire — come as you are.</p>
      </div>
    </>
  );
}
