import type { Metadata } from 'next';
import AnimationsInit from '@/components/AnimationsInit';

export const metadata: Metadata = { title: 'Support the Church' };

export default function DonationsPage() {
  return (
    <>
      <AnimationsInit />
      <div className="page-header">
        <h1>Support the Church</h1>
        <p>Your generosity helps us grow and serve our community</p>
      </div>

      <div className="content-section">
        <h2>Help Us Build a Larger Home</h2>
        <p>
          By God&apos;s grace, our congregation is growing — and our current building has become
          too small to hold all who come to worship. We are raising funds to expand our church
          so that every family, every visitor, and every soul seeking God has a place to stand
          and pray.
        </p>
        <p>
          Your donation — large or small — goes directly toward this expansion and helps sustain
          our ministries, support our clergy, and extend charity to those in need in our community.
        </p>

        <div className="donation-uses">
          <div className="donation-use-item">
            <i className="fas fa-church"></i>
            <span>Church expansion &amp; building fund</span>
          </div>
          <div className="donation-use-item">
            <i className="fas fa-hands-praying"></i>
            <span>Supporting our ministries &amp; clergy</span>
          </div>
          <div className="donation-use-item">
            <i className="fas fa-heart"></i>
            <span>Charity &amp; community outreach</span>
          </div>
          <div className="donation-use-item">
            <i className="fas fa-book-open"></i>
            <span>Sunday School &amp; education programs</span>
          </div>
        </div>

        <p>To give securely online, click the button below. You will be directed to our secure checkout page.</p>

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

        <p className="donation-note">
          Prefer to give in person? Donations are also gratefully accepted at the church
          on Sundays after the Divine Liturgy.
        </p>
      </div>
    </>
  );
}
