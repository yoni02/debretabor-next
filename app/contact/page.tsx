import type { Metadata } from 'next';
import AnimationsInit from '@/components/AnimationsInit';

export const metadata: Metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>Visit &amp; Contact</h1>
        <p>We&apos;d be glad to hear from you</p>
      </div>

      <div className="contact-info">
        <div className="contact-card">
          <h3><i className="fas fa-map-marker-alt"></i> Address</h3>
          <p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Debre+Tabor+Holy+God+Father+Ethiopian+Orthodox+Tewahedo+Church+231+Taft+St+Durham+NC+27703"
              target="_blank"
              rel="noopener noreferrer"
              className="address-link"
            >
              231 Taft St, Durham, NC 27703 <i className="fas fa-external-link-alt"></i>
            </a>
          </p>
          <p className="address-note">Click address to open in Google Maps</p>
        </div>
        <div className="contact-card">
          <h3><i className="fas fa-phone"></i> Phone</h3>
          <p><a href="tel:+19197445709" className="address-link">919-744-5709</a></p>
        </div>
        <div className="contact-card">
          <h3><i className="fas fa-envelope"></i> Email</h3>
          <p><a href="mailto:eotgfnc@gmail.com" className="address-link">eotgfnc@gmail.com</a></p>
        </div>
        <div className="contact-card">
          <h3><i className="fas fa-clock"></i> Sunday Service</h3>
          <p>Covenant Prayer — 6:30 AM</p>
          <p>Divine Liturgy — 7:00 AM – 9:30 AM</p>
        </div>
      </div>

      {/* Google Maps embed */}
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
    </>
  );
}
