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
              href="https://www.google.com/maps/search/?api=1&query=231+Taft+St+Durham+NC+27703"
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
          <p>Add your parish office phone number</p>
        </div>
        <div className="contact-card">
          <h3><i className="fas fa-envelope"></i> Email</h3>
          <p>eotgfnc@gmail.com</p>
        </div>
        <div className="contact-card">
          <h3><i className="fas fa-clock"></i> Office Hours</h3>
          <p>Contact us for office hours and availability</p>
        </div>
      </div>
    </>
  );
}
