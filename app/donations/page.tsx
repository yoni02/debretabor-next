import type { Metadata } from 'next';
import AnimationsInit from '@/components/AnimationsInit';

export const metadata: Metadata = { title: 'Support the Church' };

export default function DonationsPage() {
  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>Support the Church</h1>
        <p>Your generosity helps us sustain our ministry and serve our community</p>
      </div>
      <div className="content-section donations-content">
        <p>Debre Tabor Holy God Father Ethiopian Orthodox Tewahedo Church relies on the faithful support of our community. Donations help us maintain our church, support our ministries, and extend charity to those in need.</p>
        <p>To give securely online, click the button below. You will be taken to our secure checkout page.</p>
        <div className="donations-actions">
          <a
            href="https://checkout.square.site/merchant/Y5CCD8MF49T27/checkout/CALWRXNNP6LTQ2FANV6PHKVT"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Donate Now <i className="fas fa-external-link-alt"></i>
          </a>
        </div>
      </div>
    </>
  );
}
